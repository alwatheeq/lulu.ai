import site
site.addsitedir('.') # To allow importing from backend directory

import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# --- MODIFIED ---
import os
import sys

# Add backend directory to sys.path so we can import 'app'
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core.config import settings
from app.db.base_class import Base
# Import all models to ensure they are registered with Base.metadata
from app.models import User, Meal, Water 
# ----------------

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --- MODIFIED ---
# Use the DATABASE_URL from settings, but ensure it's async for this template
# SQLite: sqlite+aiosqlite:///...
# Since our settings.DATABASE_URL is sync (sqlite:///...), we might need to adjust it
# or use the async template properly.
# For simplicity, let's just force the known async url or adjust settings
# actually, the default settings use sync driver. 
# We should probably update settings to support async or just use sync compatible driver here if we stick to async template.
# But wait, if we used `alembic init -t async`, we should use async driver.
# Let's adjust the URL here to be async compatible if it's sqlite
db_url = settings.DATABASE_URL
if "sqlite" in db_url and "aiosqlite" not in db_url:
    db_url = db_url.replace("sqlite://", "sqlite+aiosqlite://")

config.set_main_option("sqlalchemy.url", db_url)
# ----------------

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        render_as_batch=True,
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
