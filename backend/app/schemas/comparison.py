from pydantic import BaseModel

from app.schemas.product import ProductDetailResponse


class ComparisonResponse(BaseModel):
    products: list[ProductDetailResponse]
