import traceback
from sqlalchemy import create_engine, text

def run_migration():
    engine = create_engine('postgresql://postgres:Incase%40241647@db.xvamlvmgiotmmixjzftd.supabase.co:5432/postgres')
    try:
        with open('supabase_schema.sql', 'r') as f:
            sql = f.read()
        
        with engine.connect() as conn:
            # Execute the raw SQL schema
            conn.execute(text(sql))
            conn.commit()
            print("Successfully migrated schema to Supabase!")
            
    except Exception as e:
        print(f"Error migrating schema: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    run_migration()
