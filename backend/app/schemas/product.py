from pydantic import BaseModel, ConfigDict

class ProductSpecificationResponse(BaseModel):
    name: str
    value: str
    group: str

    model_config = ConfigDict(from_attributes=True)

class ProductPriceResponse(BaseModel):
    merchant: str
    price: float
    currency: str
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
