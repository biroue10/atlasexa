from pydantic import BaseModel


class CatalogOptionsResponse(BaseModel):
    brands: list[str]
    categories: list[str]
