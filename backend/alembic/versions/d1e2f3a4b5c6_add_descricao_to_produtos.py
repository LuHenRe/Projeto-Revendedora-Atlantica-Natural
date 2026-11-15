"""Add descricao to produtos

Revision ID: d1e2f3a4b5c6
Revises: 940fa4394759
Create Date: 2026-11-13 16:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd1e2f3a4b5c6'
down_revision: Union[str, Sequence[str], None] = '940fa4394759'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('produtos', sa.Column('descricao', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('produtos', 'descricao')

