from app.db.database import get_db_context
from app.models.user import User
from app.auth.password import verify_password

def test_admin_user():
    with get_db_context() as db:
        admin = db.query(User).filter(User.email == 'admin@beacon-connect.com').first()
        print('Admin user:', admin.email if admin else 'Not found')
        print('Role:', admin.role if admin else 'N/A')
        print('Active:', admin.is_active if admin else 'N/A')
        print('Verified:', admin.is_verified if admin else 'N/A')
        
        # Test password
        if admin:
            test_password = "admin123"
            print(f'Testing password "{test_password}":')
            if verify_password(test_password, admin.hashed_password):
                print("  Password verification: SUCCESS")
            else:
                print("  Password verification: FAILED")

if __name__ == "__main__":
    test_admin_user()