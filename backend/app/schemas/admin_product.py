from datetime import datetime

from pydantic import BaseModel


class AdminProductListItem(BaseModel):
    id: int
    name: str
    slug: str
    brand: str
    category: str
    status: str
    score: int | None
    image_url: str | None
    image_count: int
    offer_count: int
    minimum_price: float | None
    currency: str | None
    model_number: str | None
    release_year: int | None
    updated_at: datetime


class AdminProductListResponse(BaseModel):
    items: list[AdminProductListItem]
    total: int
