from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_compare_two_products() -> None:
    response = client.get(
        "/api/compare",
        params={
            "slugs": (
                "lenovo-ideapad-slim-5,"
                "dell-inspiron-14"
            )
        },
    )

    assert response.status_code == 200

    data = response.json()
    products = data["products"]

    assert len(products) == 2
    assert products[0]["slug"] == "lenovo-ideapad-slim-5"
    assert products[1]["slug"] == "dell-inspiron-14"

    for product in products:
        assert len(product["specifications"]) == 6
        assert len(product["prices"]) >= 1


def test_compare_limits_results_to_four_products() -> None:
    response = client.get(
        "/api/compare",
        params={
            "slugs": (
                "lenovo-ideapad-slim-5,"
                "dell-inspiron-14,"
                "asus-vivobook-15,"
                "unknown-product,"
                "another-product"
            )
        },
    )

    assert response.status_code == 200
    assert len(response.json()["products"]) <= 4
