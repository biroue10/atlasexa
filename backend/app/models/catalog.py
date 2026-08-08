from datetime import date, datetime
from decimal import Decimal
from app.models.specification import ProductSpecification
from app.models.score import ProductScore
from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Brand(Base):
    __tablename__ = "brands"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)

    products: Mapped[list["Product"]] = relationship(
        back_populates="brand",
    )


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), unique=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)

    products: Mapped[list["Product"]] = relationship(
        back_populates="category",
    )


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    slug: Mapped[str] = mapped_column(String(270), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(1000))

    status: Mapped[str] = mapped_column(
        String(30),
        default="published",
        index=True,
    )

    gtin: Mapped[str | None] = mapped_column(
        String(32),
        nullable=True,
    )

    sku: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    mpn: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    model_number: Mapped[str | None] = mapped_column(String(150))

    release_year: Mapped[int | None] = mapped_column()

    seo_title: Mapped[str | None] = mapped_column(String(255))
    meta_description: Mapped[str | None] = mapped_column(String(500))
    canonical_url: Mapped[str | None] = mapped_column(String(1000))
    og_title: Mapped[str | None] = mapped_column(String(255))
    og_description: Mapped[str | None] = mapped_column(String(500))
    is_indexable: Mapped[bool] = mapped_column(default=True)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    brand_id: Mapped[int] = mapped_column(
        ForeignKey("brands.id"),
        index=True,
    )
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    brand: Mapped["Brand"] = relationship(back_populates="products")
    category: Mapped["Category"] = relationship(
        back_populates="products",
    )
    prices: Mapped[list["ProductPrice"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
    )
    affiliate_links: Mapped[list["AffiliateLink"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
    )
    score: Mapped["ProductScore | None"] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        uselist=False,
    )

    specifications: Mapped[list["ProductSpecification"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
    )

    images: Mapped[list["ProductImage"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductImage.position",
    )


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        index=True,
    )
    image_url: Mapped[str] = mapped_column(String(1000))
    alt_text: Mapped[str | None] = mapped_column(String(255))
    position: Mapped[int] = mapped_column(default=0)
    is_primary: Mapped[bool] = mapped_column(default=False)

    product: Mapped["Product"] = relationship(
        back_populates="images",
    )


class ProductPrice(Base):
    __tablename__ = "product_prices"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        index=True,
    )
    merchant: Mapped[str] = mapped_column(String(150))
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    market: Mapped[str] = mapped_column(String(10), default="US", index=True)
    country_code: Mapped[str] = mapped_column(String(2), default="US")
    is_affiliate: Mapped[bool] = mapped_column(default=False)
    availability: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    item_condition: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    price_valid_until: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    product_url: Mapped[str] = mapped_column(String(1000))
    checked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    product: Mapped["Product"] = relationship(back_populates="prices")


class AffiliateLink(Base):
    __tablename__ = "affiliate_links"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        index=True,
    )
    network: Mapped[str] = mapped_column(String(100))
    merchant: Mapped[str] = mapped_column(String(150))
    url: Mapped[str] = mapped_column(String(1000))
    tracking_code: Mapped[str | None] = mapped_column(String(255))

    product: Mapped["Product"] = relationship(
        back_populates="affiliate_links",
    )
