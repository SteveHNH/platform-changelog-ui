"""empty message

Revision ID: 6c7e9615ab68
Revises: ea42d275640c
Create Date: 2021-12-02 12:56:00.572897

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6c7e9615ab68'
down_revision = 'ea42d275640c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('deploy', sa.Column('timestamp', sa.DateTime(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('deploy', 'timestamp')
    # ### end Alembic commands ###
