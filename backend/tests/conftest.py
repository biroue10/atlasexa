import os
from collections.abc import Generator
from pathlib import Path

import pytest
from sqlalchemy import text
from sqlalchemy.engine import Connection
from sqlalchemy.orm import Session

TEST_ENV_FILE = Path(__file__).resolve().parents[1] / ".env.test"


def load_test_environment() -> None:
    if not TEST_ENV_FILE.exists():
        raise RuntimeError(
            "Missing backend/.env.test. Create it before running pytest."
        )

    for raw_line in TEST_ENV_FILE.read_text().splitlines():
        line = raw_line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ[key.strip()] = value.strip()


load_test_environment()

from app.db.session import engine, get_db  # noqa: E402
from app.main import app  # noqa: E402
from scripts.seed_catalog import seed_catalog  # noqa: E402
from scripts.seed_scores import seed_scores  # noqa: E402
from scripts.seed_specifications import seed_specifications  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def prepare_test_database() -> Generator[None, None, None]:
    with engine.begin() as connection:
        database_name = connection.execute(
            text("SELECT current_database()")
        ).scalar_one()

        if database_name != "atlasexa_test_db":
            raise RuntimeError(
                "Pytest refused to run because the active database is "
                f"{database_name!r}, not 'atlasexa_test_db'."
            )

        connection.execute(
            text(
                """
                TRUNCATE TABLE
                    affiliate_links,
                    product_specifications,
                    product_scores,
                    product_prices,
                    products,
                    brands,
                    categories
                RESTART IDENTITY CASCADE
                """
            )
        )

    seed_catalog()
    seed_specifications()
    seed_scores()

    yield


@pytest.fixture(autouse=True)
def isolate_api_database_changes() -> Generator[None, None, None]:
    connection: Connection = engine.connect()
    transaction = connection.begin()

    session = Session(
        bind=connection,
        autoflush=False,
        expire_on_commit=False,
    )

    def override_get_db() -> Generator[Session, None, None]:
        yield session

    app.dependency_overrides[get_db] = override_get_db

    try:
        yield
    finally:
        app.dependency_overrides.pop(get_db, None)
        session.close()

        if transaction.is_active:
            transaction.rollback()

        connection.close()
