import sqlite3

def inspect_db():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(user)")
    columns = cursor.fetchall()
    print("Columns in 'user' table:")
    for col in columns:
        # cid, name, type, notnull, dflt_value, pk
        print(f"Col: {col[1]}, Type: {col[2]}, Nullable: {not col[3]}")
    conn.close()

if __name__ == "__main__":
    inspect_db()
