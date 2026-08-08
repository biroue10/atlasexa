def test_publication_validation_helper_imports() -> None:
    from app.api.admin.products import (
        validate_product_for_publication,
    )

    assert callable(
        validate_product_for_publication
    )
