from datetime import datetime

from pydantic import BaseModel, Field


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


class AdminProductImageResponse(BaseModel):
    id: int
    image_url: str
    alt_text: str | None
    position: int
    is_primary: bool


class AdminProductSpecificationResponse(BaseModel):
    id: int
    name: str
    value: str
    group: str


class AdminProductOfferResponse(BaseModel):
    id: int
    merchant: str
    price: float
    currency: str
    market: str
    country_code: str
    is_affiliate: bool
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
    specifications: list[AdminProductSpecificationInput] = Field(
        default_factory=list
    )
    offers: list[AdminProductOfferInput] = Field(
        default_factory=list
    )


class AdminProductCreateResponse(BaseModel):
    id: int
    slug: str
    status: str


class AdminProductDetailResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None
    brand: str
    category: str
    status: str
    model_number: str | None
    release_year: int | None
    image_url: str | None
    score: int | None
    score_explanation: str | None
    specifications: list[AdminProductSpecificationResponse]
    images: list[AdminProductImageResponse]
    offers: list[AdminProductOfferResponse]
    created_at: datetime
    updated_at: datetime


class AdminProductUpdateRequest(BaseModel):
    name: str
    slug: str
    brand: str
    category: str
    description: str | None = None
    model_number: str | None = None
    release_year: int | None = None
    status: str
    score: int | None = None
    score_explanation: str | None = None
    specifications: list[AdminProductSpecificationInput] = Field(
        default_factory=list
    )
    offers: list[AdminProductOfferInput] = Field(
        default_factory=list
    )


class AdminProductImageOrderItem(BaseModel):
    id: int
    position: int


class AdminProductImageOrderRequest(BaseModel):
    images: list[AdminProductImageOrderItem]


class AdminProductImageUpdateRequest(BaseModel):
    alt_text: str | None = None
