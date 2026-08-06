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


def test_rejects_invalid_sort_value() -> None:
    response = client.get(
        "/api/products",
        params={"sort_by": "invalid"},
    )

    assert response.status_code == 422


def test_rejects_negative_maximum_price() -> None:
    response = client.get(
        "/api/products",
        params={"max_price": -100},
    )

    assert response.status_code == 422


def test_rejects_invalid_page() -> None:
    response = client.get(
        "/api/products",
        params={"page": 0},
    )

    assert response.status_code == 422


def test_rejects_excessive_page_size() -> None:
    response = client.get(
        "/api/products",
        params={"page_size": 100},
    )

    assert response.status_code == 422


def test_search_products_by_name() -> None:
    response = client.get(
        "/api/products",
        params={"q": "Lenovo"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["slug"] == "lenovo-ideapad-slim-5"


def test_search_products_by_description() -> None:
    response = client.get(
        "/api/products",
        params={"q": "programming"},
    )

    assert response.status_code == 200

    slugs = [
        product["slug"]
        for product in response.json()["items"]
    ]

    assert "lenovo-ideapad-slim-5" in slugs


def test_search_products_by_brand_is_case_insensitive() -> None:
    response = client.get(
        "/api/products",
        params={"q": "asus"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["slug"] == "asus-vivobook-15"


def test_rejects_search_query_that_is_too_short() -> None:
    response = client.get(
        "/api/products",
        params={"q": "a"},
    )

    assert response.status_code == 422


def test_rejects_search_query_that_is_too_long() -> None:
    response = client.get(
        "/api/products",
        params={"q": "a" * 101},
    )

    assert response.status_code == 422


def test_rejects_whitespace_only_search_query() -> None:
    response = client.get(
        "/api/products",
        params={"q": "   "},
    )

    assert response.status_code == 422
    assert response.json()["detail"] == (
        "Search query must contain at least 2 characters."
    )


def test_search_query_is_trimmed() -> None:
    response = client.get(
        "/api/products",
        params={"q": "  Lenovo  "},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["slug"] == "lenovo-ideapad-slim-5"


def test_sort_products_by_relevance() -> None:
    response = client.get(
        "/api/products",
        params={
            "q": "Lenovo",
            "sort_by": "relevance",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["slug"] == "lenovo-ideapad-slim-5"


def test_relevance_without_query_falls_back_safely() -> None:
    response = client.get(
        "/api/products",
        params={"sort_by": "relevance"},
    )

    assert response.status_code == 200
    assert response.json()["total"] == 3
