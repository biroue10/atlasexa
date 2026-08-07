from decimal import Decimal

from sqlalchemy import select

from app.data.catalog_seed import CATALOG
from app.db.session import SessionLocal
from app.models import (
    Brand,
    Category,
    Product,
    ProductImage,
    ProductPrice,
    ProductScore,
    ProductSpecification,
)


def get_or_create_brand(db, name: str, slug: str) -> Brand:
    brand = db.scalar(
        select(Brand).where(Brand.slug == slug)
    )

    if brand is None:
        brand = Brand(
            name=name,
            slug=slug,
        )
        db.add(brand)
        db.flush()

    return brand


def get_or_create_category(db, name: str, slug: str) -> Category:
    category = db.scalar(
        select(Category).where(Category.slug == slug)
    )

    if category is None:
        category = Category(
            name=name,
            slug=slug,
        )
        db.add(category)
        db.flush()

    return category


def seed_catalog_full() -> None:
    with SessionLocal() as db:
        created = 0
        updated = 0

        for category_data in CATALOG:
            category_info = category_data["category"]

            category = get_or_create_category(
                db,
                category_info["name"],
                category_info["slug"],
            )

            for product_data in category_data["products"]:
                brand_info = product_data["brand"]

                brand = get_or_create_brand(
                    db,
                    brand_info["name"],
                    brand_info["slug"],
                )

                product = db.scalar(
                    select(Product).where(
                        Product.slug == product_data["slug"]
                    )
                )

                if product is None:
                    product = Product(
                        name=product_data["name"],
                        slug=product_data["slug"],
                        description=product_data["description"],
                        image_url=product_data.get("image_url"),
                        brand=brand,
                        category=category,
                    )

                    db.add(product)
                    db.flush()
                    created += 1
                else:
                    product.name = product_data["name"]
                    product.description = product_data["description"]
                    product.image_url = product_data.get("image_url")
                    product.brand = brand
                    product.category = category
                    updated += 1

                existing_images = {
                    image.image_url: image
                    for image in db.scalars(
                        select(ProductImage).where(
                            ProductImage.product_id == product.id
                        )
                    )
                }

                configured_images = product_data.get("images", [])

                for image_data in configured_images:
                    image = existing_images.get(
                        image_data["image_url"]
                    )

                    if image is None:
                        db.add(
                            ProductImage(
                                product_id=product.id,
                                image_url=image_data["image_url"],
                                alt_text=image_data.get("alt_text"),
                                position=image_data.get("position", 0),
                                is_primary=image_data.get(
                                    "is_primary",
                                    False,
                                ),
                            )
                        )
                    else:
                        image.alt_text = image_data.get("alt_text")
                        image.position = image_data.get("position", 0)
                        image.is_primary = image_data.get(
                            "is_primary",
                            False,
                        )

                price = db.scalar(
                    select(ProductPrice).where(
                        ProductPrice.product_id == product.id,
                        ProductPrice.merchant == "Demo Store",
                    )
                )

                if price is None:
                    db.add(
                        ProductPrice(
                            product_id=product.id,
                            merchant="Demo Store",
                            price=Decimal(product_data["price"]),
                            currency="USD",
                            product_url=(
                                "https://example.com/"
                                f"{product_data['slug']}"
                            ),
                        )
                    )
                else:
                    price.price = Decimal(product_data["price"])
                    price.currency = "USD"

                score = db.scalar(
                    select(ProductScore).where(
                        ProductScore.product_id == product.id
                    )
                )

                if score is None:
                    db.add(
                        ProductScore(
                            product_id=product.id,
                            overall_score=product_data["score"],
                            explanation=product_data[
                                "score_explanation"
                            ],
                        )
                    )
                else:
                    score.overall_score = product_data["score"]
                    score.explanation = product_data[
                        "score_explanation"
                    ]

                existing_specs = {
                    specification.name: specification
                    for specification in db.scalars(
                        select(ProductSpecification).where(
                            ProductSpecification.product_id
                            == product.id
                        )
                    )
                }

                for name, value, group in product_data[
                    "specifications"
                ]:
                    specification = existing_specs.get(name)

                    if specification is None:
                        db.add(
                            ProductSpecification(
                                product_id=product.id,
                                name=name,
                                value=value,
                                group=group,
                            )
                        )
                    else:
                        specification.value = value
                        specification.group = group

        db.commit()

        print(
            "Full catalog seed completed. "
            f"Created: {created}. Updated: {updated}."
        )


if __name__ == "__main__":
    seed_catalog_full()
