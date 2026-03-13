from sqlalchemy import create_engine
from sqlalchemy.schema import CreateTable
from app.db.base_class import Base

# Import all models to ensure they are registered with Base.metadata
from app.models.user import User
from app.models.client import Client, JournalEntry
from app.models.meal import Meal
from app.models.water import Water

def generate_sql():
    # Use a dummy postgres engine just for compilation
    engine = create_engine('postgresql://')
    
    with open('supabase_schema.sql', 'w') as f:
        # Generate raw SQL for all tables
        for table in Base.metadata.sorted_tables:
            create_stmt = CreateTable(table).compile(engine)
            f.write(str(create_stmt).strip() + ';\n\n')
            
    print("Schema generated successfully in supabase_schema.sql")

if __name__ == "__main__":
    generate_sql()
