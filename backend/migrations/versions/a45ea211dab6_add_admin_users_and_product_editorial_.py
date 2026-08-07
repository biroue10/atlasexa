"""add admin users and product editorial fields

Revision ID: a45ea211dab6
Revises: 915381c883c5
Create Date: 2026-08-07 23:18:38.233683
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a45ea211dab6"
down_revision: Union[str, Sequence[str], None] = "915381c883c5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "admin_users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("role", sa.String(length=30), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_admin_users_email"),
        "admin_users",
        ["email"],
        unique=True,
    )

    op.create_index(
        op.f("ix_admin_users_role"),
        "admin_users",
        ["role"],
        unique=False,
    )

    op.add_column(
        "products",
        sa.Column(
            "status",
            sa.String(length=30),
            nullable=False,
            server_default="published",
        ),
    )

    op.alter_column(
        "products",
        "status",
        server_default=None,
    )

    op.add_column(
        "products",
        sa.Column(
            "model_number",
            sa.String(length=150),
            nullable=True,
        ),
    )

    op.add_column(
        "products",
        sa.Column(
            "release_year",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "products",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )

    op.create_index(
        op.f("ix_products_status"),
        "products",
        ["status"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_products_status"),
        table_name="products",
    )

    op.drop_column("products", "updated_at")
    op.drop_column("products", "release_year")
    op.drop_column("products", "model_number")
    op.drop_column("products", "status")

    op.drop_index(
        op.f("ix_admin_users_role"),
        table_name="admin_users",
    )

    op.drop_index(
        op.f("ix_admin_users_email"),
        table_name="admin_users",
    )

    op.drop_table("admin_users")
