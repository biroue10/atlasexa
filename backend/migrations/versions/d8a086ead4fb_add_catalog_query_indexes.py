"""add catalog query indexes

Revision ID: d8a086ead4fb
Revises: 9b83f80925f8
Create Date: 2026-08-06 00:47:46.463490

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd8a086ead4fb'
down_revision: Union[str, Sequence[str], None] = '9b83f80925f8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
