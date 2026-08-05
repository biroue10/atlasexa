from sqlalchemy import select

from app.db.session import SessionLocal
from app.models import Product, ProductSpecification


SPECIFICATIONS = {
    "lenovo-ideapad-slim-5": [
        ("Processor", "AMD Ryzen 7", "Performance"),
        ("Memory", "16 GB RAM", "Performance"),
        ("Storage", "512 GB SSD", "Performance"),
        ("Display", "14-inch IPS", "Display"),
        ("Battery life", "Up to 12 hours", "Battery"),
        ("Weight", "1.46 kg", "Design"),
    ],
    "dell-inspiron-14": [
        ("Processor", "Intel Core i5", "Performance"),
        ("Memory", "16 GB RAM", "Performance"),
        ("Storage", "512 GB SSD", "Performance"),
        ("Display", "14-inch Full HD", "Display"),
        ("Battery life", "Up to 10 hours", "Battery"),
        ("Weight", "1.54 kg", "Design"),
    ],
    "asus-vivobook-15": [
        ("Processor", "AMD Ryzen 5", "Performance"),
        ("Memory", "8 GB RAM", "Performance"),
        ("Storage", "512 GB SSD", "Performance"),
        ("Display", "15.6-inch Full HD", "Display"),
        ("Battery life", "Up to 8 hours", "Battery"),
        ("Weight", "1.70 kg", "Design"),
    ],
}


def seed_specifications() -> None:
    with SessionLocal() as db:
        for slug, specifications in SPECIFICATIONS.items():
            product = db.scalar(
                select(Product).where(Product.slug == slug)
            )

            if product is None:
                print(f"Product not found: {slug}")
                continue

            existing = db.scalar(
                select(ProductSpecification).where(
                    ProductSpecification.product_id == product.id
                )
            )

            if existing is not None:
                print(f"Specifications already exist: {slug}")
                continue

            for name, value, group in specifications:
                db.add(
                    ProductSpecification(
                        product_id=product.id,
                        name=name,
                        value=value,
                        group=group,
                    )
                )

        db.commit()

    print("Product specifications seeded.")


if __name__ == "__main__":
    seed_specifications()
