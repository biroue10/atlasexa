from decimal import Decimal

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models import Brand, Category, Product, ProductPrice


def seed_catalog() -> None:
    with SessionLocal() as db:
        existing_brand = db.scalar(
            select(Brand).where(Brand.slug == "lenovo")
        )

        if existing_brand is not None:
            print("Seed data already exists.")
            return

        laptop_category = Category(
            name="Laptops",
            slug="laptops",
        )

        lenovo = Brand(
            name="Lenovo",
            slug="lenovo",
        )

        dell = Brand(
            name="Dell",
            slug="dell",
        )

        asus = Brand(
            name="ASUS",
            slug="asus",
        )

        products = [
            Product(
                name="Lenovo IdeaPad Slim 5",
                slug="lenovo-ideapad-slim-5",
                description=(
                    "Balanced laptop for productivity, programming "
                    "and everyday use."
                ),
                brand=lenovo,
                category=laptop_category,
                prices=[
                    ProductPrice(
                        merchant="Demo Store",
                        price=Decimal("849.99"),
                        currency="USD",
                        product_url="https://example.com/lenovo-ideapad-slim-5",
                    )
                ],
            ),
            Product(
                name="Dell Inspiron 14",
                slug="dell-inspiron-14",
                description=(
                    "Reliable laptop with good value for everyday productivity."
                ),
                brand=dell,
                category=laptop_category,
                prices=[
                    ProductPrice(
                        merchant="Demo Store",
                        price=Decimal("799.99"),
                        currency="USD",
                        product_url="https://example.com/dell-inspiron-14",
                    )
                ],
            ),
            Product(
                name="ASUS Vivobook 15",
                slug="asus-vivobook-15",
                description=(
                    "Affordable laptop suitable for study and general use."
                ),
                brand=asus,
                category=laptop_category,
                prices=[
                    ProductPrice(
                        merchant="Demo Store",
                        price=Decimal("699.99"),
                        currency="USD",
                        product_url="https://example.com/asus-vivobook-15",
                    )
                ],
            ),
        ]

        db.add_all(products)
        db.commit()

        print("Catalog seed completed.")


if __name__ == "__main__":
    seed_catalog()
