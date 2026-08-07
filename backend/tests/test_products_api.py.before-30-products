from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_existing_product() -> None:
    response = client.get(
        "/api/products/lenovo-ideapad-slim-5"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Lenovo IdeaPad Slim 5"
    assert data["brand"] == "Lenovo"
    assert len(data["prices"]) >= 1
    assert len(data["specifications"]) == 6


def test_get_unknown_product_returns_404() -> None:
    response = client.get(
        "/api/products/product-that-does-not-exist"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found."
