from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.admin_security import get_current_admin
from app.db.session import get_db
from app.models import (
    AdminUser,
    Brand,
    Category,
    Product,
    ProductImage,
    ProductPrice,
)
from app.models.score import ProductScore
from app.schemas.admin_product import (
    AdminProductListItem,
    AdminProductListResponse,
)


router = APIRouter(
    prefix="/api/admin/products",
    tags=["admin-products"],
)


@router.get(
    "",
    response_model=AdminProductListResponse,
)
def list_admin_products(
    _: Annotated[
        AdminUser,
        Depends(get_current_admin),
    ],
    db: Annotated[Session, Depends(get_db)],
    q: str = Query(default="", max_length=100),
    status: str = Query(default=""),
) -> AdminProductListResponse:
    image_count = (
        select(
            ProductImage.product_id,
            func.count(ProductImage.id).label("image_count"),
        )
        .group_by(ProductImage.product_id)
        .subquery()
    )

    offer_count = (
        select(
            ProductPrice.product_id,
            func.count(ProductPrice.id).label("offer_count"),
        )
        .group_by(ProductPrice.product_id)
        .subquery()
    )

    minimum_price = (
        select(
            ProductPrice.product_id,
            func.min(ProductPrice.price).label("minimum_price"),
            func.min(ProductPrice.currency).label("currency"),
        )
        .group_by(ProductPrice.product_id)
        .subquery()
    )

    statement = (
        select(
            Product,
            Brand.name.label("brand_name"),
            Category.name.label("category_name"),
            ProductScore.score.label("product_score"),
            func.coalesce(
                image_count.c.image_count,
                0,
            ).label("image_count"),
            func.coalesce(
                offer_count.c.offer_count,
                0,
            ).label("offer_count"),
            minimum_price.c.minimum_price,
            minimum_price.c.currency,
        )
        .join(Brand, Product.brand_id == Brand.id)
        .join(Category, Product.category_id == Category.id)
        .outerjoin(
            ProductScore,
            ProductScore.product_id == Product.id,
        )
        .outerjoin(
            image_count,
            image_count.c.product_id == Product.id,
        )
        .outerjoin(
            offer_count,
            offer_count.c.product_id == Product.id,
        )
        .outerjoin(
            minimum_price,
            minimum_price.c.product_id == Product.id,
        )
    )

    normalized_query = q.strip()

    if normalized_query:
        pattern = f"%{normalized_query}%"

        statement = statement.where(
            Product.name.ilike(pattern)
            | Brand.name.ilike(pattern)
            | Product.slug.ilike(pattern)
        )

    if status:
        statement = statement.where(
            Product.status == status,
        )

    statement = statement.order_by(
        Product.updated_at.desc(),
        Product.name.asc(),
    )

    rows = db.execute(statement).all()

    items = [
        AdminProductListItem(
            id=product.id,
            name=product.name,
            slug=product.slug,
            brand=brand_name,
            category=category_name,
            status=product.status,
            score=product_score,
            image_url=product.image_url,
            image_count=int(image_total),
            offer_count=int(offer_total),
            minimum_price=(
                float(price)
                if price is not None
                else None
            ),
            currency=currency,
            model_number=product.model_number,
            release_year=product.release_year,
            updated_at=product.updated_at,
        )
        for (
            product,
            brand_name,
            category_name,
            product_score,
            image_total,
            offer_total,
            price,
            currency,
        ) in rows
    ]

    return AdminProductListResponse(
        items=items,
        total=len(items),
    )
