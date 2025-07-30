from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# this line:
from app.database import Base  # ensure Base.metadata is available

# then later:
target_metadata = Base.metadata