from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.search import ProductResult, SearchRequest, SearchResponse
from app.services.catalog_search import search_catalog
from app.services.query_parser import extract_max_price

router = APIRouter(prefix="/api", tags=["search"])


@router.post("/search", response_model=SearchResponse)
async def search_products(
    request: SearchRequest,
    db: Session = Depends(get_db),
) -> SearchResponse:
    query = request.query.strip()
    max_price = extract_max_price(query)

    products = search_catalog(
        db,
        query,
        max_price=max_price,
    )

    results: list[ProductResult] = []

    for index, product in enumerate(products):
        latest_price = product.prices[0] if product.prices else None

        results.append(
            ProductResult(
                name=product.name,
                slug=product.slug,
                price=float(latest_price.price) if latest_price else 0.0,
                currency=latest_price.currency if latest_price else "USD",
                score=max(70, 92 - index * 4),
                reason=(
                    product.description
                    or "Product available in the Atlasexa catalog."
                ),
            )
        )

    summary = (
        f"Found {len(results)} matching products in the Atlasexa catalog."
        if results
        else "No matching products were found in the Atlasexa catalog."
    )

    return SearchResponse(
        query=query,
        summary=summary,
        products=results,
    )
