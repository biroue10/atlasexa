from pydantic import BaseModel


class HomeHighlightProduct(BaseModel):
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


class HomeHighlightsResponse(BaseModel):
    items: list[HomeHighlightProduct]
