from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_catalog_options_returns_brands_and_categories() -> None:
    response = client.get("/api/catalog/options")

    assert response.status_code == 200

    data = response.json()

    assert data["categories"] == [
        "Headphones",
        "Laptops",
        "Monitors",
        "Smartphones",
        "Smartwatches",
        "Tablets",
    ]

    assert data["brands"] == sorted(data["brands"], key=str.casefold)
    assert {
        "Apple",
        "ASUS",
        "Dell",
        "Lenovo",
        "Samsung",
        "Sony",
    }.issubset(set(data["brands"]))
