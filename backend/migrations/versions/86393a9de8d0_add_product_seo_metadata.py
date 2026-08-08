"""add product seo metadata

Revision ID: 86393a9de8d0
Revises: a45ea211dab6
Create Date: 2026-08-08 02:59:36.387068
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "86393a9de8d0"
down_revision: Union[str, Sequence[str], None] = "a45ea211dab6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column(
            "seo_title",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.add_column(
        "products",
        sa.Column(
            "meta_description",
            sa.String(length=500),
            nullable=True,
        ),
    )

    op.add_column(
        "products",
        sa.Column(
            "canonical_url",
            sa.String(length=1000),
            nullable=True,
        ),
    )

    op.add_column(
        "products",
        sa.Column(
            "og_title",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.add_column(
        "products",
        sa.Column(
            "og_description",
            sa.String(length=500),
            nullable=True,
        ),
    )

    op.add_column(
        "products",
        sa.Column(
            "is_indexable",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )

    op.alter_column(
        "products",
        "is_indexable",
        server_default=None,
    )


def downgrade() -> None:
    op.drop_column(
        "products",
        "is_indexable",
    )

    op.drop_column(
        "products",
        "og_description",
    )

    op.drop_column(
        "products",
        "og_title",
    )

    op.drop_column(
        "products",
        "canonical_url",
    )

    op.drop_column(
        "products",
        "meta_description",
    )

    op.drop_column(
        "products",
        "seo_title",
    )
