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

class AdminProductSpecificationInput(BaseModel):
    name: str
    value: str
    group: str = "General"


class AdminProductOfferInput(BaseModel):
    merchant: str
    price: float
    currency: str = "USD"
    market: str = "US"
    country_code: str = "US"
    is_affiliate: bool = False
    product_url: str


class AdminProductCreateRequest(BaseModel):
    name: str
    brand: str
    category: str
    slug: str
    description: str | None = None
    model_number: str | None = None
    release_year: int | None = None
    status: str = "draft"
    score: int | None = None
    score_explanation: str | None = None
    specifications: list[AdminProductSpecificationInput] = []
    offers: list[AdminProductOfferInput] = []


class AdminProductCreateResponse(BaseModel):
    id: int
    slug: str
    status: str


class AdminProductImageResponse(BaseModel):
    id: int
    image_url: str
    alt_text: str | None
    position: int
    is_primary: bool
