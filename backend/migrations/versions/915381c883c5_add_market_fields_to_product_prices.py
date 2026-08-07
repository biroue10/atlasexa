"""add market fields to product prices

Revision ID: 915381c883c5
Revises: bf7469a497d5
Create Date: 2026-08-07

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "915381c883c5"
down_revision: Union[str, Sequence[str], None] = "bf7469a497d5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "product_prices",
        sa.Column(
            "market",
            sa.String(length=10),
            nullable=False,
            server_default="US",
        ),
    )

    op.add_column(
        "product_prices",
        sa.Column(
            "country_code",
            sa.String(length=2),
            nullable=False,
            server_default="US",
        ),
    )

    op.add_column(
        "product_prices",
        sa.Column(
            "is_affiliate",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.create_index(
        "ix_product_prices_market",
        "product_prices",
        ["market"],
    )

    op.create_index(
        "ix_product_prices_product_market",
        "product_prices",
        ["product_id", "market"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_product_prices_product_market",
        table_name="product_prices",
    )

    op.drop_index(
        "ix_product_prices_market",
        table_name="product_prices",
    )

    op.drop_column("product_prices", "is_affiliate")
    op.drop_column("product_prices", "country_code")
    op.drop_column("product_prices", "market")
