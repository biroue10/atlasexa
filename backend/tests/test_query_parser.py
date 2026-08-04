from decimal import Decimal

from app.services.query_parser import extract_max_price


def test_extract_price_with_dollar_sign() -> None:
    assert extract_max_price(
        "Best laptop under $900 for programming"
    ) == Decimal("900")


def test_extract_price_without_currency_symbol() -> None:
    assert extract_max_price(
        "Laptop below 750"
    ) == Decimal("750")


def test_extract_price_with_up_to_phrase() -> None:
    assert extract_max_price(
        "Find a monitor up to 400"
    ) == Decimal("400")


def test_returns_none_without_budget() -> None:
    assert extract_max_price(
        "Best laptop for programming"
    ) is None
