from pathlib import Path

from app.services import product_images


def test_move_product_image_directory(
    tmp_path: Path,
    monkeypatch,
) -> None:
    monkeypatch.setattr(
        product_images.settings,
        "media_root",
        str(tmp_path),
    )

    monkeypatch.setattr(
        product_images.settings,
        "public_api_url",
        "https://api.atlasexa.com",
    )

    old_dir = (
        tmp_path
        / "products"
        / "old-product"
    )

    old_dir.mkdir(
        parents=True,
    )

    old_file = (
        old_dir
        / "old-product-front.webp"
    )

    old_file.write_bytes(
        b"test-image"
    )

    mapping = (
        product_images
        .move_product_image_directory(
            old_slug="old-product",
            new_slug="new-product",
        )
    )

    new_file = (
        tmp_path
        / "products"
        / "new-product"
        / "new-product-front.webp"
    )

    assert not old_dir.exists()
    assert new_file.exists()

    assert mapping[
        "https://api.atlasexa.com/media/products/"
        "old-product/old-product-front.webp"
    ] == (
        "https://api.atlasexa.com/media/products/"
        "new-product/new-product-front.webp"
    )
