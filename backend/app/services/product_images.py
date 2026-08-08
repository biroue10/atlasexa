import io
import re
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_WIDTH = 1600
WEBP_QUALITY = 82

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


def slugify(value: str) -> str:
    normalized = re.sub(
        r"[^a-z0-9]+",
        "-",
        value.lower().strip(),
    )

    return normalized.strip("-")


async def process_product_image(
    *,
    file: UploadFile,
    product_slug: str,
    position: int,
) -> tuple[str, str]:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only JPEG, PNG and WebP images are supported.",
        )

    raw = await file.read()

    if len(raw) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image exceeds the 10 MB upload limit.",
        )

    try:
        image = Image.open(io.BytesIO(raw))
        image.load()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Unable to decode uploaded image.",
        )

    image = ImageOps.exif_transpose(image)

    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA")

    if image.width > MAX_WIDTH:
        ratio = MAX_WIDTH / image.width

        image = image.resize(
            (
                MAX_WIDTH,
                max(1, int(image.height * ratio)),
            ),
            Image.Resampling.LANCZOS,
        )

    if image.mode == "RGBA":
        background = Image.new(
            "RGB",
            image.size,
            "white",
        )

        background.paste(
            image,
            mask=image.getchannel("A"),
        )

        image = background
    else:
        image = image.convert("RGB")

    original_stem = Path(
        file.filename or f"image-{position}"
    ).stem

    descriptive_stem = slugify(original_stem)

    if not descriptive_stem:
        descriptive_stem = f"image-{position:02d}"

    seo_filename = (
        f"{product_slug}-"
        f"{descriptive_stem}.webp"
    )

    directory = (
        Path(settings.media_root)
        / "products"
        / product_slug
    )

    directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    output_path = directory / seo_filename

    image.save(
        output_path,
        "WEBP",
        quality=WEBP_QUALITY,
        method=6,
    )

    public_url = (
        f"{settings.public_api_url.rstrip('/')}"
        f"/media/products/"
        f"{product_slug}/"
        f"{seo_filename}"
    )

    return public_url, seo_filename


def move_product_image_directory(
    *,
    old_slug: str,
    new_slug: str,
) -> dict[str, str]:
    """Move product media after a slug change.

    Returns a mapping of old public image URLs to new public URLs.
    """

    if old_slug == new_slug:
        return {}

    products_root = (
        Path(settings.media_root)
        / "products"
    )

    old_directory = (
        products_root
        / old_slug
    )

    new_directory = (
        products_root
        / new_slug
    )

    # Some products may still use external or legacy images
    # and therefore have no local media directory.
    if not old_directory.exists():
        return {}

    if new_directory.exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Unable to change product slug because "
                "the destination image directory already exists."
            ),
        )

    old_base_url = (
        f"{settings.public_api_url.rstrip('/')}"
        f"/media/products/{old_slug}/"
    )

    new_base_url = (
        f"{settings.public_api_url.rstrip('/')}"
        f"/media/products/{new_slug}/"
    )

    old_directory.rename(
        new_directory,
    )

    url_mapping: dict[str, str] = {}

    try:
        for file_path in list(
            new_directory.iterdir()
        ):
            if not file_path.is_file():
                continue

            old_filename = file_path.name
            new_filename = old_filename

            prefix = f"{old_slug}-"

            if old_filename.startswith(prefix):
                new_filename = (
                    f"{new_slug}-"
                    f"{old_filename[len(prefix):]}"
                )

            destination = (
                new_directory
                / new_filename
            )

            if (
                destination != file_path
                and destination.exists()
            ):
                raise RuntimeError(
                    "Image filename collision while "
                    "changing product slug."
                )

            if destination != file_path:
                file_path.rename(
                    destination,
                )

            old_url = (
                old_base_url
                + old_filename
            )

            new_url = (
                new_base_url
                + new_filename
            )

            url_mapping[
                old_url
            ] = new_url

    except Exception:
        # Best-effort filesystem rollback.
        if (
            new_directory.exists()
            and not old_directory.exists()
        ):
            new_directory.rename(
                old_directory,
            )

        raise

    return url_mapping


def rollback_product_image_directory(
    *,
    old_slug: str,
    new_slug: str,
) -> None:
    """Best-effort rollback after a database failure."""

    if old_slug == new_slug:
        return

    products_root = (
        Path(settings.media_root)
        / "products"
    )

    old_directory = (
        products_root
        / old_slug
    )

    new_directory = (
        products_root
        / new_slug
    )

    if (
        not new_directory.exists()
        or old_directory.exists()
    ):
        return

    # Restore filenames first.
    for file_path in list(
        new_directory.iterdir()
    ):
        if not file_path.is_file():
            continue

        prefix = f"{new_slug}-"

        if not file_path.name.startswith(
            prefix
        ):
            continue

        restored_name = (
            f"{old_slug}-"
            f"{file_path.name[len(prefix):]}"
        )

        file_path.rename(
            new_directory
            / restored_name
        )

    new_directory.rename(
        old_directory,
    )
