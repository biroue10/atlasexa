#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_ROOT="$(
  cd "$(dirname "${BASH_SOURCE[0]}")/.." &&
  pwd
)"

echo "========================================"
echo " Atlasexa complete validation"
echo "========================================"

echo
echo "[1/7] Backend tests"
cd "$PROJECT_ROOT/backend"
source venv/bin/activate
pytest -q

echo
echo "[2/7] Python compilation"
python -m compileall app tests scripts

echo
echo "[3/7] Alembic migration consistency"
TEST_DATABASE_URL="$(
  grep '^DATABASE_URL=' .env.test |
  cut -d= -f2-
)"

DATABASE_URL="$TEST_DATABASE_URL" alembic current
DATABASE_URL="$TEST_DATABASE_URL" alembic heads

echo
echo "[4/7] Frontend tests"
cd "$PROJECT_ROOT/frontend"
npm run test

echo
echo "[5/7] Frontend production build"
npm run build

echo
echo "[6/7] Frontend lint"
npm run lint

echo
echo "[7/7] JavaScript performance budget"
npm run validate:performance

echo
echo "========================================"
echo " All Atlasexa validations passed"
echo "========================================"
