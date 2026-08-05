from datetime import datetime
from decimal import Decimal
from app.models.specification import ProductSpecification
from app.models.score import ProductScore
from sqlalchemy import (
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
