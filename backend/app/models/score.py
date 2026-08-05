from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ProductScore(Base):
    __tablename__ = "product_scores"
    __table_args__ = (
        CheckConstraint(
            "overall_score >= 0 AND overall_score <= 100",
            name="ck_product_score_range",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        unique=True,
        index=True,
    )

    overall_score: Mapped[int] = mapped_column(Integer)
    explanation: Mapped[str | None] = mapped_column(Text)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    product: Mapped["Product"] = relationship(
        back_populates="score",
    )
