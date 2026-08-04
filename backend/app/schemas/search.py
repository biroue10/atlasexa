from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(min_length=3, max_length=500)


class ProductResult(BaseModel):
    name: str
    price: float
    currency: str
    score: int
    reason: str
    slug: str


class SearchResponse(BaseModel):
    query: str
    summary: str
    products: list[ProductResult]
