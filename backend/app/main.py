from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.rate_limit import limiter

from app.core.config import settings
from app.api.search import router as search_router
from app.api.health import router as health_router
from app.api.products import router as products_router
from app.api.comparison import router as comparison_router
from app.api.catalog import router as catalog_router
from app.api.home import router as home_router
from app.api.admin.auth import router as admin_auth_router
from app.api.admin.dashboard import router as admin_dashboard_router
from app.api.admin.products import router as admin_products_router

app = FastAPI(
    title="Atlasexa API",
    version="0.1.0",
    description="Backend API for Atlasexa.",
)

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in settings.cors_origins.split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(search_router)
app.include_router(products_router)
app.include_router(comparison_router)
app.include_router(catalog_router)
app.include_router(home_router)
app.include_router(admin_auth_router)
app.include_router(admin_dashboard_router)
app.include_router(admin_products_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "name": "Atlasexa API",
        "status": "running",
    }
