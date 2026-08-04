from sqlalchemy import text

from app.db.session import engine


def main() -> None:
    with engine.connect() as connection:
        database = connection.execute(
            text("SELECT current_database()")
        ).scalar_one()

        user = connection.execute(
            text("SELECT current_user")
        ).scalar_one()

        print(f"Database: {database}")
        print(f"User: {user}")
        print("Connection successful")


if __name__ == "__main__":
    main()
