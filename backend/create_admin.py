import sys
import os
import argparse

# Add parent directory to path so we can import 'app' module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def make_superuser(email: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"User with email {email} not found. Creating one...")
            # Create default admin user
            new_user = User(
                email=email,
                hashed_password=get_password_hash("admin123"), # Default password
                full_name="Admin User",
                is_active=True,
                is_superuser=True,
                plan="Pro",
                # role="admin" - Removing as role column doesn't exist
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            print(f"Created new Admin user: {email} / admin123")
            return

        user.is_superuser = True
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Successfully promoted {email} to Superuser/Admin!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", help="Email of user to promote", required=True)
    args = parser.parse_args()
    make_superuser(args.email)
