"""Add categoria_origem to produtos_matriz

Revision ID: e2f3a4b5c6d7
Revises: d1e2f3a4b5c6
Create Date: 2026-11-17 18:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e2f3a4b5c6d7'
down_revision: Union[str, Sequence[str], None] = 'd1e2f3a4b5c6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('produtos_matriz', sa.Column('categoria_origem', sa.String(), nullable=True))
    op.create_index(op.f('ix_produtos_matriz_categoria_origem'), 'produtos_matriz', ['categoria_origem'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_produtos_matriz_categoria_origem'), table_name='produtos_matriz')
    op.drop_column('produtos_matriz', 'categoria_origem')
