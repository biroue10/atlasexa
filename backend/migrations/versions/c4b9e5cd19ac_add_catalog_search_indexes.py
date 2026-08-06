"""add catalog search indexes

Revision ID: c4b9e5cd19ac
Revises: d8a086ead4fb
Create Date: 2026-08-06 01:03:48.057196

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4b9e5cd19ac'
down_revision: Union[str, Sequence[str], None] = 'd8a086ead4fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
