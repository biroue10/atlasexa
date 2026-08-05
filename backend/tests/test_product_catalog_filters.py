from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_filter_products_by_brand() -> None:
    response = client.get(
        "/api/products",
        params={"brand": "Lenovo"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["slug"] == "lenovo-ideapad-slim-5"


def test_filter_products_by_maximum_price() -> None:
    response = client.get(
        "/api/products",
        params={"max_price": 750},
    )

    assert response.status_code == 200

    items = response.json()["items"]

    assert len(items) == 1
    assert items[0]["slug"] == "asus-vivobook-15"
    assert items[0]["minimum_price"] == 699.99


def test_sort_products_by_lowest_price() -> None:
    response = client.get(
        "/api/products",
        params={"sort_by": "price_low"},
    )

    assert response.status_code == 200

    slugs = [
        product["slug"]
        for product in response.json()["items"]
    ]

    assert slugs == [
        "asus-vivobook-15",
        "dell-inspiron-14",
        "lenovo-ideapad-slim-5",
    ]


def test_sort_products_by_highest_price() -> None:
    response = client.get(
        "/api/products",
        params={"sort_by": "price_high"},
    )

    assert response.status_code == 200

    slugs = [
        product["slug"]
        for product in response.json()["items"]
    ]

    assert slugs == [
        "lenovo-ideapad-slim-5",
        "dell-inspiron-14",
        "asus-vivobook-15",
    ]


def test_sort_products_by_score() -> None:
    response = client.get(
        "/api/products",
        params={"sort_by": "score"},
    )

    assert response.status_code == 200

    scores = [
        product["score"]
        for product in response.json()["items"]
    ]

    assert scores == [91, 88, 84]
