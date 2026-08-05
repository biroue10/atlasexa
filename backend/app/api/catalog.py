from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Brand, Category
from app.schemas.catalog import CatalogOptionsResponse

router = APIRouter(prefix="/api/catalog", tags=["catalog"])


@router.get("/options", response_model=CatalogOptionsResponse)
async def get_catalog_options(
    db: Session = Depends(get_db),
) -> CatalogOptionsResponse:
    brands = list(
        db.scalars(
            select(Brand.name).order_by(Brand.name.asc())
        )
    )

    categories = list(
        db.scalars(
            select(Category.name).order_by(Category.name.asc())
        )
    )

    return CatalogOptionsResponse(
        brands=brands,
        categories=categories,
    )
