from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.search import router as search_router
from app.api.health import router as health_router
from app.api.products import router as products_router
from app.api.comparison import router as comparison_router

app = FastAPI(
    title="Atlasexa API",
    version="0.1.0",
    description="Backend API for Atlasexa.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
	"http://192.168.11.104:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(search_router)
app.include_router(products_router)
app.include_router(comparison_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "name": "Atlasexa API",
        "status": "running",
    }
