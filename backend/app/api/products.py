from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Product
from app.schemas.product import (
    ProductDetailResponse,
    ProductPriceResponse,
)

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/{slug}", response_model=ProductDetailResponse)
async def get_product(
    slug: str,
    db: Session = Depends(get_db),
) -> ProductDetailResponse:
    statement = (
        select(Product)
        .options(
            selectinload(Product.brand),
            selectinload(Product.category),
            selectinload(Product.prices),
        )
        .where(Product.slug == slug)
    )

    product = db.scalar(statement)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    return ProductDetailResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        description=product.description,
        image_url=product.image_url,
        brand=product.brand.name,
        category=product.category.name,
        prices=[
            ProductPriceResponse(
                merchant=price.merchant,
                price=float(price.price),
                currency=price.currency,
                product_url=price.product_url,
            )
            for price in product.prices
        ],
    )
