import sys
import os
# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.orm import Session
from app.db.database import get_db_context
from app.db.seed_data import seed_admin_user
from app.models.user import User
from app.auth.password import verify_password, get_password_hash

def test_admin_password():
    """Test the admin password hashing and verification"""
    print("Testing admin password...")
    
    # Test password hashing
    password = "admin123"
    hashed = get_password_hash(password)
    print(f"Plain password: {password}")
    print(f"Hashed password: {hashed}")
    
    # Verify the password
    is_valid = verify_password(password, hashed)
    print(f"Password verification result: {is_valid}")
    
    # Test with the database
    print("\nTesting with database...")
    try:
        with get_db_context() as db:
            # Seed admin user if not exists
            seed_admin_user(db)
            
            # Get the admin user
            admin_user = db.query(User).filter(User.email == "admin@beacon-connect.com").first()
            if admin_user:
                print(f"Admin user found: {admin_user.email}")
                print(f"Admin user hashed password: {admin_user.hashed_password}")
                print(f"Admin user role: {admin_user.role}")
                print(f"Admin user is_active: {admin_user.is_active}")
                
                # Verify the password
                is_valid = verify_password(password, admin_user.hashed_password)
                print(f"Admin password verification result: {is_valid}")
            else:
                print("Admin user not found in database")
    except Exception as e:
        print(f"Error testing with database: {e}")

if __name__ == "__main__":
    test_admin_password()