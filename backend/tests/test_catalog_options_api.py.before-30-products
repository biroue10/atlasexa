from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_catalog_options_returns_brands_and_categories() -> None:
    response = client.get("/api/catalog/options")

    assert response.status_code == 200

    data = response.json()

    assert data["brands"] == ["ASUS", "Dell", "Lenovo"]
    assert data["categories"] == ["Laptops"]
