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
