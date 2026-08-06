#!/usr/bin/env sh

set -eu

echo "Applying database migrations..."
alembic upgrade head

PRODUCT_COUNT="$(
python - <<'PY'
from sqlalchemy import func, select

from app.db.session import SessionLocal
from app.models import Product

with SessionLocal() as db:
    print(db.scalar(select(func.count(Product.id))) or 0)
PY
)"

if [ "$PRODUCT_COUNT" -eq 0 ]; then
    echo "Catalog is empty. Seeding initial data..."

    python -m scripts.seed_catalog
    python -m scripts.seed_specifications
    python -m scripts.seed_scores

    echo "Initial data seeded."
else
    echo "Catalog already contains $PRODUCT_COUNT products. Skipping seed."
fi

echo "Starting Atlasexa API..."

exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000
