from pydantic import BaseModel, ConfigDict

class ProductSpecificationResponse(BaseModel):
    name: str
    value: str
    group: str

    model_config = ConfigDict(from_attributes=True)

class ProductImageResponse(BaseModel):
    image_url: str
    alt_text: str | None
    position: int
    is_primary: bool

    model_config = ConfigDict(from_attributes=True)


class ProductPriceResponse(BaseModel):
    merchant: str
    price: float
    currency: str
    market: str
    country_code: str
    is_affiliate: bool
    product_url: str

    model_config = ConfigDict(from_attributes=True)


class ProductDetailResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None
    image_url: str | None
    brand: str
    category: str
    score: int
    score_explanation: str | None
    prices: list[ProductPriceResponse]
    images: list[ProductImageResponse]
    specifications: list[ProductSpecificationResponse]


class ProductListItemResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None
    image_url: str | None
    brand: str
    category: str
    score: int
    minimum_price: float | None
    currency: str | None
    best_for: str | None


class ProductListResponse(BaseModel):
    items: list[ProductListItemResponse]
    total: int
    page: int
    page_size: int
