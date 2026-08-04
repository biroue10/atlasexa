from fastapi import APIRouter

from app.schemas.search import ProductResult, SearchRequest, SearchResponse

router = APIRouter(prefix="/api", tags=["search"])


@router.post("/search", response_model=SearchResponse)
async def search_products(request: SearchRequest) -> SearchResponse:
    return SearchResponse(
        query=request.query,
        summary="These are temporary demonstration results.",
        products=[
            ProductResult(
                name="Dell Inspiron 14",
                price=799.99,
                currency="USD",
                score=88,
                reason="Good performance and value for everyday productivity.",
            ),
            ProductResult(
                name="Lenovo IdeaPad Slim 5",
                price=849.99,
                currency="USD",
                score=91,
                reason="Strong balance of performance, battery life and build quality.",
            ),
            ProductResult(
                name="ASUS Vivobook 15",
                price=699.99,
                currency="USD",
                score=84,
                reason="Affordable option with suitable specifications.",
            ),
        ],
    )
