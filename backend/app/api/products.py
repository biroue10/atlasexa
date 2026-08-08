from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.core.rate_limit import limiter
from app.db.session import get_db
from app.models import Brand, Category, Product, ProductPrice, ProductScore
from app.schemas.product import (
    ProductDetailResponse,
    ProductImageResponse,
    ProductPriceResponse,
    ProductSpecificationResponse,
    ProductListItemResponse,
    ProductListResponse,
)

router = APIRouter(prefix="/api/products", tags=["products"])
@router.get("", response_model=ProductListResponse)
@limiter.limit("120/minute")
async def list_products(
    request: Request,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    q: str | None = Query(default=None, max_length=100),
    brand: str | None = None,
    category: str | None = None,
    max_price: float | None = Query(default=None, ge=0),
    sort_by: Literal[
        "relevance",
        "score",
        "price_low",
        "price_high",
        "name",
    ] = "score",
    db: Session = Depends(get_db),
) -> ProductListResponse:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 50)

    filters = []
    normalized_query: str | None = None

    if q is not None:
        normalized_query = q.strip()

        if len(normalized_query) < 2:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Search query must contain at least 2 characters.",
            )

        search_pattern = f"%{normalized_query}%"

        filters.append(
            or_(
                Product.name.ilike(search_pattern),
                func.coalesce(Product.description, "").ilike(
                    search_pattern
                ),
                Brand.name.ilike(search_pattern),
            )
        )

    if brand:
        filters.append(Brand.name.ilike(brand.strip()))

    if category:
        filters.append(Category.name.ilike(category.strip()))

    if max_price is not None:
        filters.append(
            Product.prices.any(ProductPrice.price <= max_price)
        )

    count_statement = (
        select(func.count(Product.id))
        .join(Product.brand)
        .join(Product.category)
    )

    if filters:
        count_statement = count_statement.where(*filters)

    total = db.scalar(count_statement) or 0

    statement = (
        select(Product)
        .join(Product.brand)
        .join(Product.category)
        .outerjoin(
            ProductScore,
            ProductScore.product_id == Product.id,
        )
        .options(
            selectinload(Product.brand),
            selectinload(Product.category),
            selectinload(Product.prices),
            selectinload(Product.score),
            selectinload(Product.specifications),
        )
    )

    if filters:
        statement = statement.where(*filters)

    minimum_price_expression = (
        select(func.min(ProductPrice.price))
        .where(ProductPrice.product_id == Product.id)
        .correlate(Product)
        .scalar_subquery()
    )

    if sort_by == "relevance" and normalized_query:
        relevance_expression = func.greatest(
            func.similarity(Product.name, normalized_query) * 3,
            func.similarity(
                func.coalesce(Product.description, ""),
                normalized_query,
            ),
            func.similarity(Brand.name, normalized_query) * 2,
        )

        statement = statement.order_by(
            relevance_expression.desc(),
            ProductScore.overall_score.desc().nullslast(),
            Product.name.asc(),
        )
    elif sort_by == "price_low":
        statement = statement.order_by(
            minimum_price_expression.asc().nullslast(),
            Product.name.asc(),
        )
    elif sort_by == "price_high":
        statement = statement.order_by(
            minimum_price_expression.desc().nullslast(),
            Product.name.asc(),
        )
    elif sort_by == "name":
        statement = statement.order_by(Product.name.asc())
    else:
        statement = statement.order_by(
            ProductScore.overall_score.desc().nullslast(),
            Product.name.asc(),
        )

    statement = (
        statement
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    products = list(db.scalars(statement).unique())
    items = []

    for product in products:
        prices = sorted(
            product.prices,
            key=lambda price: price.price,
        )
        lowest_price = prices[0] if prices else None

        best_for = next(
            (
                specification.value
                for specification in product.specifications
                if specification.name.lower() == "best for"
            ),
            None,
        )

        items.append(
            ProductListItemResponse(
                id=product.id,
                name=product.name,
                slug=product.slug,
                description=product.description,
                image_url=product.image_url,
                brand=product.brand.name,
                category=product.category.name,
                score=product.score.overall_score if product.score else 0,
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


    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{slug}", response_model=ProductDetailResponse)
@limiter.limit("120/minute")
async def get_product(
    request: Request,
    slug: str,
    db: Session = Depends(get_db),
) -> ProductDetailResponse:
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
        model_number=product.model_number,
        gtin=product.gtin,
        sku=product.sku,
        mpn=product.mpn,
        score=product.score.overall_score if product.score else 0,
        score_explanation=(
            product.score.explanation if product.score else None
        ),
        seo_title=product.seo_title,
        meta_description=product.meta_description,
        canonical_url=product.canonical_url,
        og_title=product.og_title,
        og_description=product.og_description,
        is_indexable=product.is_indexable,
        prices=[
            ProductPriceResponse(
                merchant=price.merchant,
                price=float(price.price),
                currency=price.currency,
                    market=price.market,
                    country_code=price.country_code,
                    is_affiliate=price.is_affiliate,
                availability=price.availability,
                item_condition=price.item_condition,
                price_valid_until=price.price_valid_until,
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
