import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.auth.password import verify_password

def check_user(email: str, password: str):
    # Create a database engine with the correct URL for Docker
    DATABASE_URL = "postgresql://postgres:postgres@localhost:55589/beacon"
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create a database session
    db = SessionLocal()
    
    try:
        # Find user by email
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            print(f"User found: {user.email}")
            print(f"User ID: {user.id}")
            print(f"User role: {user.role}")
            print(f"User is_active: {user.is_active}")
            print(f"User is_verified: {user.is_verified}")
            print(f"Hashed password: {user.hashed_password}")
            
            # Verify password
            is_valid = verify_password(password, user.hashed_password)
            print(f"Password verification result: {is_valid}")
        else:
            print(f"User with email {email} not found")
    finally:
        db.close()

if __name__ == "__main__":
    check_user("sarah.johnson@example.com", "password123")