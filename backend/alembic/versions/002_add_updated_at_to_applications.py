"""Add updated_at column to applications table

Revision ID: 002
Revises: 001
Create Date: 2025-09-12 23:15:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add updated_at column to applications table
    op.add_column('applications', sa.Column('updated_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    # Remove updated_at column from applications table
    op.drop_column('applications', 'updated_at')