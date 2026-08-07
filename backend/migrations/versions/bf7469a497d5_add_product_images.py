"""add product images

Revision ID: bf7469a497d5
Revises: c4b9e5cd19ac
Create Date: 2026-08-07 02:24:09.676854

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "bf7469a497d5"
down_revision: Union[str, Sequence[str], None] = "c4b9e5cd19ac"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "product_images",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "product_id",
            sa.Integer(),
            sa.ForeignKey("products.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("image_url", sa.String(length=1000), nullable=False),
        sa.Column("alt_text", sa.String(length=255), nullable=True),
        sa.Column(
            "position",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "is_primary",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.create_index(
        "ix_product_images_product_id",
        "product_images",
        ["product_id"],
    )

    op.create_index(
        "ix_product_images_product_position",
        "product_images",
        ["product_id", "position"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_product_images_product_position",
        table_name="product_images",
    )
    op.drop_index(
        "ix_product_images_product_id",
        table_name="product_images",
    )
    op.drop_table("product_images")
