from pydantic import BaseModel, ConfigDict


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
    prices: list[ProductPriceResponse]
