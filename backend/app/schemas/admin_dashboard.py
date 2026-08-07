from pydantic import BaseModel


class AdminDashboardResponse(BaseModel):
    total_products: int
    published_products: int
    draft_products: int
    archived_products: int
    missing_images: int
    missing_offers: int
