from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ProductSpecification(Base):
    __tablename__ = "product_specifications"
    __table_args__ = (
        UniqueConstraint(
            "product_id",
            "name",
            name="uq_product_specification_name",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        index=True,
    )

    name: Mapped[str] = mapped_column(String(150))
    value: Mapped[str] = mapped_column(String(500))
    group: Mapped[str] = mapped_column(
        String(100),
        default="General",
    )

    product: Mapped["Product"] = relationship(
        back_populates="specifications",
    )
