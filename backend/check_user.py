import sys
import os
from sqlalchemy.orm import Session
from app.db.database import get_db_context
from app.models.user import User
from app.auth.password import verify_password, get_password_hash

def check_admin_user():
    """Check if admin user exists and verify password"""
    print("Checking for admin user...")
    
    try:
        with get_db_context() as db:
            # Check if admin user exists
            admin_user = db.query(User).filter(User.email == "admin@beacon-connect.com").first()
            
            if admin_user:
                print(f"Admin user found:")
                print(f"  Email: {admin_user.email}")
                print(f"  Role: {admin_user.role}")
                print(f"  Is active: {admin_user.is_active}")
                print(f"  Is verified: {admin_user.is_verified}")
                
                # Test password verification
                test_password = "admin123"
                print(f"\nTesting password '{test_password}':")
                if verify_password(test_password, admin_user.hashed_password):
                    print("  Password verification: SUCCESS")
                else:
                    print("  Password verification: FAILED")
                    print(f"  Hashed password in DB: {admin_user.hashed_password}")
                    print(f"  Hashed test password: {get_password_hash(test_password)}")
            else:
                print("Admin user NOT found in database")
                
            # List all users
            print("\nAll users in database:")
            users = db.query(User).all()
            for user in users:
                print(f"  - {user.email} ({user.role})")
                
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Add backend to Python path
    sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
    check_admin_user()