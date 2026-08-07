from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Product
from app.schemas.comparison import ComparisonResponse
from app.schemas.product import (
    ProductDetailResponse,
    ProductImageResponse,
    ProductPriceResponse,
    ProductSpecificationResponse,
)

router = APIRouter(prefix="/api", tags=["comparison"])


@router.get("/compare", response_model=ComparisonResponse)
async def compare_products(
    slugs: str = Query(min_length=1),
    db: Session = Depends(get_db),
) -> ComparisonResponse:
    slug_list = [
        slug.strip()
        for slug in slugs.split(",")
        if slug.strip()
    ][:4]

    statement = (
        select(Product)
        .options(
            selectinload(Product.brand),
            selectinload(Product.category),
            selectinload(Product.prices),
            selectinload(Product.specifications),
            selectinload(Product.images),
            selectinload(Product.score),
        )
        .where(Product.slug.in_(slug_list))
    )

    products = list(db.scalars(statement).unique())

    products_by_slug = {
        product.slug: product
        for product in products
    }

    ordered_products = [
        products_by_slug[slug]
        for slug in slug_list
        if slug in products_by_slug
    ]

    response_products = [
        ProductDetailResponse(
            id=product.id,
            name=product.name,
            slug=product.slug,
            description=product.description,
            image_url=product.image_url,
            brand=product.brand.name,
            category=product.category.name,
            score=product.score.overall_score if product.score else 0,
            score_explanation=(
                product.score.explanation if product.score else None
            ),
            prices=[
                ProductPriceResponse(
                    merchant=price.merchant,
                    price=float(price.price),
                    currency=price.currency,
                    product_url=price.product_url,
                )
                for price in product.prices
            ],
            images=[
                ProductImageResponse(
                    image_url=image.image_url,
                    alt_text=image.alt_text,
                    position=image.position,
                    is_primary=image.is_primary,
                )
                for image in product.images
            ],
            specifications=[
                ProductSpecificationResponse(
                    name=specification.name,
                    value=specification.value,
                    group=specification.group,
                )
                for specification in product.specifications
            ],
        )
        for product in ordered_products
    ]

    return ComparisonResponse(products=response_products)
