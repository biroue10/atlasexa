import re
from decimal import Decimal
from decimal import Decimal

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.models import Brand, Category, Product, ProductPrice, ProductScore

STOP_WORDS = {
    "a",
    "an",
    "and",
    "best",
    "for",
    "find",
    "me",
    "of",
    "the",
    "under",
    "with",
}


def extract_keywords(query: str) -> list[str]:
    words = re.findall(r"[a-zA-Z0-9]+", query.lower())

    return [
        word
        for word in words
        if len(word) >= 3
        and word not in STOP_WORDS
        and not word.isdigit()
    ]


def search_catalog(
    db: Session,
    query: str,
    max_price: Decimal | None = None,
) -> list[Product]:
    keywords = extract_keywords(query)
    conditions = []

    for keyword in keywords:
        pattern = f"%{keyword}%"

        conditions.extend(
            [
                Product.name.ilike(pattern),
                Product.description.ilike(pattern),
                Brand.name.ilike(pattern),
                Category.name.ilike(pattern),
            ]
        )

    statement = (
        select(Product)
        .join(Product.brand)
        .join(Product.category)
        .outerjoin(ProductScore, ProductScore.product_id == Product.id)
        .options(
            selectinload(Product.prices),
            selectinload(Product.brand),
            selectinload(Product.category),
            selectinload(Product.score),
        )
    )

    if conditions:
        statement = statement.where(or_(*conditions))

    if max_price is not None:
        statement = statement.where(
            Product.prices.any(ProductPrice.price <= max_price)
        )

    statement = statement.order_by(
        ProductScore.overall_score.desc().nullslast(),
        Product.name.asc(),
    ).limit(10)

    return list(db.scalars(statement).unique())
