"""add product identifiers and offer metadata

Revision ID: 7cb2f38dccf8
Revises: 86393a9de8d0
Create Date: 2026-08-08 03:49:51.537775
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7cb2f38dccf8"
down_revision: Union[str, Sequence[str], None] = "86393a9de8d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column(
            "gtin",
            sa.String(length=32),
            nullable=True,
        ),
    )

    op.add_column(
        "products",
        sa.Column(
            "sku",
            sa.String(length=100),
            nullable=True,
        ),
    )

    op.add_column(
        "products",
        sa.Column(
            "mpn",
            sa.String(length=100),
            nullable=True,
        ),
    )

    op.add_column(
        "product_prices",
        sa.Column(
            "availability",
            sa.String(length=50),
            nullable=True,
        ),
    )

    op.add_column(
        "product_prices",
        sa.Column(
            "item_condition",
            sa.String(length=50),
            nullable=True,
        ),
    )

    op.add_column(
        "product_prices",
        sa.Column(
            "price_valid_until",
            sa.Date(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column(
        "product_prices",
        "price_valid_until",
    )

    op.drop_column(
        "product_prices",
        "item_condition",
    )

    op.drop_column(
        "product_prices",
        "availability",
    )

    op.drop_column(
        "products",
        "mpn",
    )

    op.drop_column(
        "products",
        "sku",
    )

    op.drop_column(
        "products",
        "gtin",
    )
