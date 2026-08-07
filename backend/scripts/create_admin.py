from getpass import getpass

from sqlalchemy import select

from app.core.admin_security import hash_password
from app.db.session import SessionLocal
from app.models import AdminUser


def main() -> None:
    email = input("Admin email: ").strip().lower()
    name = input("Admin name: ").strip()

    password = getpass("Password: ")
    confirm = getpass("Confirm password: ")

    if not email:
        raise SystemExit("Email is required.")

    if not name:
        raise SystemExit("Name is required.")

    if password != confirm:
        raise SystemExit("Passwords do not match.")

    if len(password) < 12:
        raise SystemExit(
            "Use a password with at least 12 characters."
        )

    with SessionLocal() as db:
        existing = db.scalar(
            select(AdminUser).where(
                AdminUser.email == email
            )
        )

        if existing:
            raise SystemExit(
                "An admin with this email already exists."
            )

        admin = AdminUser(
            email=email,
            name=name,
            role="owner",
            is_active=True,
            password_hash=hash_password(password),
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print()
        print("Admin created successfully")
        print("ID:", admin.id)
        print("Email:", admin.email)
        print("Name:", admin.name)
        print("Role:", admin.role)


if __name__ == "__main__":
    main()
