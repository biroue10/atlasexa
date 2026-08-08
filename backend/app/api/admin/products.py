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
            ProductScore.overall_score.label("product_score"),
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


from decimal import Decimal
from fastapi import HTTPException, status as http_status

from app.models.specification import ProductSpecification
from app.schemas.admin_product import (
    AdminProductCreateRequest,
    AdminProductCreateResponse,
)


@router.post(
    "",
    response_model=AdminProductCreateResponse,
    status_code=201,
)
def create_admin_product(
    payload: AdminProductCreateRequest,
    _: Annotated[
        AdminUser,
        Depends(get_current_admin),
    ],
    db: Annotated[Session, Depends(get_db)],
) -> AdminProductCreateResponse:
    allowed_statuses = {
        "draft",
        "published",
        "archived",
    }

    if payload.status not in allowed_statuses:
        raise HTTPException(
            status_code=http_status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid product status.",
        )

    existing = db.scalar(
        select(Product).where(
            Product.slug == payload.slug.strip(),
        )
    )

    if existing:
        raise HTTPException(
            status_code=http_status.HTTP_409_CONFLICT,
            detail="A product with this slug already exists.",
        )

    brand_name = payload.brand.strip()
    category_name = payload.category.strip()

    brand = db.scalar(
        select(Brand).where(
            func.lower(Brand.name)
            == brand_name.lower(),
        )
    )

    if brand is None:
        brand = Brand(
            name=brand_name,
            slug=brand_name.lower()
            .replace(" ", "-"),
        )
        db.add(brand)
        db.flush()

    category = db.scalar(
        select(Category).where(
            func.lower(Category.name)
            == category_name.lower(),
        )
    )

    if category is None:
        category = Category(
            name=category_name,
            slug=category_name.lower()
            .replace(" ", "-"),
        )
        db.add(category)
        db.flush()

    product = Product(
        name=payload.name.strip(),
        slug=payload.slug.strip(),
        description=payload.description,
        image_url=None,
        status=payload.status,
        model_number=payload.model_number,
        release_year=payload.release_year,
        brand_id=brand.id,
        category_id=category.id,
    )

    db.add(product)
    db.flush()

    for specification in payload.specifications:
        db.add(
            ProductSpecification(
                product_id=product.id,
                name=specification.name.strip(),
                value=specification.value.strip(),
                group=specification.group.strip()
                or "General",
            )
        )

    if payload.score is not None:
        if payload.score < 0 or payload.score > 100:
            raise HTTPException(
                status_code=http_status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Score must be between 0 and 100.",
            )

        db.add(
            ProductScore(
                product_id=product.id,
                overall_score=payload.score,
                explanation=payload.score_explanation,
            )
        )

    for offer in payload.offers:
        db.add(
            ProductPrice(
                product_id=product.id,
                merchant=offer.merchant.strip(),
                price=Decimal(str(offer.price)),
                currency=offer.currency.upper(),
                market=offer.market.upper(),
                country_code=offer.country_code.upper(),
                is_affiliate=offer.is_affiliate,
                product_url=offer.product_url.strip(),
            )
        )

    db.commit()
    db.refresh(product)

    return AdminProductCreateResponse(
        id=product.id,
        slug=product.slug,
        status=product.status,
    )


from fastapi import File, Form, UploadFile

from app.services.product_images import (
    process_product_image,
)
from app.schemas.admin_product import (
    AdminProductImageResponse,
)


@router.post(
    "/{product_id}/images",
    response_model=list[AdminProductImageResponse],
)
async def upload_product_images(
    product_id: int,
    _: Annotated[
        AdminUser,
        Depends(get_current_admin),
    ],
    db: Annotated[Session, Depends(get_db)],
    files: list[UploadFile] = File(...),
    alt_text: str = Form(default=""),
) -> list[AdminProductImageResponse]:
    product = db.get(Product, product_id)

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found.",
        )

    if len(files) > 8:
        raise HTTPException(
            status_code=422,
            detail="A maximum of 8 images can be uploaded at once.",
        )

    current_count = db.scalar(
        select(func.count(ProductImage.id))
        .where(
            ProductImage.product_id
            == product.id,
        )
    ) or 0

    created: list[ProductImage] = []

    for offset, file in enumerate(files):
        position = current_count + offset

        image_url, _ = await process_product_image(
            file=file,
            product_slug=product.slug,
            position=position,
        )

        image = ProductImage(
            product_id=product.id,
            image_url=image_url,
            alt_text=(
                alt_text.strip()
                or f"{product.name} product image"
            ),
            position=position,
            is_primary=(current_count == 0 and offset == 0),
        )

        db.add(image)
        db.flush()

        created.append(image)

        if image.is_primary:
            product.image_url = image_url

    db.commit()

    return [
        AdminProductImageResponse(
            id=image.id,
            image_url=image.image_url,
            alt_text=image.alt_text,
            position=image.position,
            is_primary=image.is_primary,
        )
        for image in created
    ]


@router.delete(
    "/{product_id}/images/{image_id}",
    status_code=204,
)
def delete_product_image(
    product_id: int,
    image_id: int,
    _: Annotated[
        AdminUser,
        Depends(get_current_admin),
    ],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    product = db.get(Product, product_id)

    image = db.get(
        ProductImage,
        image_id,
    )

    if (
        product is None
        or image is None
        or image.product_id != product.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Image not found.",
        )

    was_primary = image.is_primary

    db.delete(image)
    db.flush()

    if was_primary:
        next_image = db.scalar(
            select(ProductImage)
            .where(
                ProductImage.product_id
                == product.id,
            )
            .order_by(
                ProductImage.position.asc(),
            )
        )

        if next_image is not None:
            next_image.is_primary = True
            product.image_url = (
                next_image.image_url
            )
        else:
            product.image_url = None

    db.commit()


@router.post(
    "/{product_id}/images/{image_id}/primary",
    response_model=AdminProductImageResponse,
)
def set_primary_product_image(
    product_id: int,
    image_id: int,
    _: Annotated[
        AdminUser,
        Depends(get_current_admin),
    ],
    db: Annotated[Session, Depends(get_db)],
) -> AdminProductImageResponse:
    product = db.get(Product, product_id)

    image = db.get(
        ProductImage,
        image_id,
    )

    if (
        product is None
        or image is None
        or image.product_id != product.id
    ):
        raise HTTPException(
            status_code=404,
            detail="Image not found.",
        )

    images = db.scalars(
        select(ProductImage)
        .where(
            ProductImage.product_id
            == product.id,
        )
    ).all()

    for product_image in images:
        product_image.is_primary = (
            product_image.id == image.id
        )

    product.image_url = image.image_url

    db.commit()
    db.refresh(image)

    return AdminProductImageResponse(
        id=image.id,
        image_url=image.image_url,
        alt_text=image.alt_text,
        position=image.position,
        is_primary=image.is_primary,
    )
