from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.admin_security import get_current_admin
from app.db.session import get_db
from app.models import AdminUser, Product, ProductImage, ProductPrice
from app.schemas.admin_dashboard import AdminDashboardResponse


router = APIRouter(
    prefix="/api/admin/dashboard",
    tags=["admin-dashboard"],
)


@router.get(
    "",
    response_model=AdminDashboardResponse,
)
def dashboard(
    _: Annotated[
        AdminUser,
        Depends(get_current_admin),
    ],
    db: Annotated[Session, Depends(get_db)],
) -> AdminDashboardResponse:
    total_products = db.scalar(
        select(func.count()).select_from(Product)
    ) or 0

    published_products = db.scalar(
        select(func.count())
        .select_from(Product)
        .where(Product.status == "published")
    ) or 0

    draft_products = db.scalar(
        select(func.count())
        .select_from(Product)
        .where(Product.status == "draft")
    ) or 0

    archived_products = db.scalar(
        select(func.count())
        .select_from(Product)
        .where(Product.status == "archived")
    ) or 0

    missing_images = db.scalar(
        select(func.count())
        .select_from(Product)
        .where(
            ~select(ProductImage.id)
            .where(ProductImage.product_id == Product.id)
            .exists()
        )
    ) or 0

    missing_offers = db.scalar(
        select(func.count())
        .select_from(Product)
        .where(
            ~select(ProductPrice.id)
            .where(ProductPrice.product_id == Product.id)
            .exists()
        )
    ) or 0

    return AdminDashboardResponse(
        total_products=total_products,
        published_products=published_products,
        draft_products=draft_products,
        archived_products=archived_products,
        missing_images=missing_images,
        missing_offers=missing_offers,
    )
