from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_search_results_are_ranked_by_score() -> None:
    response = client.post(
        "/api/search",
        json={
            "query": "Best laptop under $900 for programming",
        },
    )

    assert response.status_code == 200

    products = response.json()["products"]

    assert len(products) == 3
    assert [product["score"] for product in products] == [91, 88, 84]
    assert [product["slug"] for product in products] == [
        "lenovo-ideapad-slim-5",
        "dell-inspiron-14",
        "asus-vivobook-15",
    ]


def test_search_applies_budget_filter() -> None:
    response = client.post(
        "/api/search",
        json={
            "query": "Best laptop under $750 for programming",
        },
    )

    assert response.status_code == 200

    products = response.json()["products"]

    assert len(products) == 1
    assert products[0]["slug"] == "asus-vivobook-15"
    assert products[0]["price"] == 699.99


def test_search_returns_empty_list_when_no_match_exists() -> None:
    response = client.post(
        "/api/search",
        json={
            "query": "Professional espresso machine under $100",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["products"] == []
    assert data["summary"] == (
        "No matching products were found in the Atlasexa catalog."
    )
