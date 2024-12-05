"""Recreate schema

Revision ID: e580c7706c35
Revises: 
Create Date: 2024-12-05 03:27:23.663365

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e580c7706c35'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('work_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.Integer(), nullable=False),
    sa.Column('check_in_time', sa.DateTime(), nullable=True),
    sa.Column('check_out_time', sa.DateTime(), nullable=True),
    sa.Column('worked_hours', sa.Float(), nullable=True),
    sa.Column('log_date', sa.Date(), nullable=False),
    sa.Column('holidays', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['employee_id'], ['employee.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('work_log')
    # ### end Alembic commands ###