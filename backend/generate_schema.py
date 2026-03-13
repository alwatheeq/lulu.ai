import os
from sqlalchemy import create_engine
from app.db.base_class import Base
from app.core.config import settings
from app.models.user import User
from app.models.client import Client, JournalEntry
from app.models.meal import Meal
from app.models.water import Water

engine = create_engine(settings.DATABASE_URL)

def init_db():
    print(f"Connecting to database at {settings.DATABASE_URL}...")
    try:
        # Create all tables defined in Base.metadata
        Base.metadata.create_all(bind=engine)
        print("Successfully created/verified all SQL schemas on Supabase!")
    except Exception as e:
        print(f"An error occurred while creating tables: {e}")

if __name__ == "__main__":
    init_db()
