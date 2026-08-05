from sqlalchemy import select

from app.db.session import SessionLocal
from app.models import Product, ProductScore


SCORES = {
    "lenovo-ideapad-slim-5": (
        91,
        "Strong balance of performance, battery life and build quality.",
    ),
    "dell-inspiron-14": (
        88,
        "Reliable performance and good value for everyday productivity.",
    ),
    "asus-vivobook-15": (
        84,
        "Affordable option with suitable specifications for general use.",
    ),
}


def seed_scores() -> None:
    with SessionLocal() as db:
        for slug, (score, explanation) in SCORES.items():
            product = db.scalar(
                select(Product).where(Product.slug == slug)
            )

            if product is None:
                print(f"Product not found: {slug}")
                continue

            existing_score = db.scalar(
                select(ProductScore).where(
                    ProductScore.product_id == product.id
                )
            )

            if existing_score is not None:
                existing_score.overall_score = score
                existing_score.explanation = explanation
                print(f"Score updated: {slug}")
                continue

            db.add(
                ProductScore(
                    product_id=product.id,
                    overall_score=score,
                    explanation=explanation,
                )
            )

            print(f"Score created: {slug}")

        db.commit()

    print("Product scores seeded.")


if __name__ == "__main__":
    seed_scores()
