from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload
from fastapi import APIRouter, Depends

from app.db.session import get_db
from app.models import Product, ProductPrice, ProductScore
from app.schemas.home import (
    HomeHighlightProduct,
    HomeHighlightsResponse,
)

router = APIRouter(prefix="/api/home", tags=["home"])


@router.get("/highlights", response_model=HomeHighlightsResponse)
async def get_home_highlights(
    db: Session = Depends(get_db),
) -> HomeHighlightsResponse:
    ranked_products = (
        select(
            Product.id.label("product_id"),
            func.row_number()
            .over(
                partition_by=Product.category_id,
                order_by=(
                    ProductScore.overall_score.desc(),
                    Product.name.asc(),
                ),
            )
            .label("rank"),
        )
        .join(
            ProductScore,
            ProductScore.product_id == Product.id,
        )
        .subquery()
    )

    statement = (
        select(Product)
        .join(
            ranked_products,
            ranked_products.c.product_id == Product.id,
        )
        .where(ranked_products.c.rank == 1)
        .options(
            selectinload(Product.brand),
            selectinload(Product.category),
            selectinload(Product.prices),
            selectinload(Product.score),
            selectinload(Product.specifications),
        )
        .order_by(Product.category_id.asc())
    )

    products = list(db.scalars(statement).unique())

    items: list[HomeHighlightProduct] = []

    for product in products:
        lowest_price = min(
            product.prices,
            key=lambda price: price.price,
            default=None,
        )

        best_for = next(
            (
                specification.value
                for specification in product.specifications
                if specification.name.lower() == "best for"
            ),
            None,
        )

        items.append(
            HomeHighlightProduct(
                id=product.id,
                name=product.name,
                slug=product.slug,
                description=product.description,
                image_url=product.image_url,
                brand=product.brand.name,
                category=product.category.name,
                score=(
                    product.score.overall_score
                    if product.score
                    else 0
                ),
                minimum_price=(
                    float(lowest_price.price)
                    if lowest_price
                    else None
                ),
                currency=(
                    lowest_price.currency
                    if lowest_price
                    else None
                ),
                best_for=best_for,
            )
        )

    return HomeHighlightsResponse(items=items)
