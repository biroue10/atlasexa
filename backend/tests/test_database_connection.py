from sqlalchemy import text

from app.db.session import engine


def test_database_connection_uses_test_database() -> None:
    with engine.connect() as connection:
        database = connection.execute(
            text("SELECT current_database()")
        ).scalar_one()

        user = connection.execute(
            text("SELECT current_user")
        ).scalar_one()

    assert database == "atlasexa_test_db"
    assert user == "atlasexa_user"


def test_pg_trgm_extension_is_available() -> None:
    with engine.connect() as connection:
        extension = connection.execute(
            text(
                """
                SELECT extname
                FROM pg_extension
                WHERE extname = 'pg_trgm'
                """
            )
        ).scalar_one_or_none()

        similarity = connection.execute(
            text(
                """
                SELECT similarity(
                    'Lenovo'::text,
                    'Lenovo'::text
                )
                """
            )
        ).scalar_one()

    assert extension == "pg_trgm"
    assert similarity == 1.0
