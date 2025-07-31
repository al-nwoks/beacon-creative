import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from app.auth.password import verify_password, get_password_hash

def test_password_hashing():
    # Test password
    password = "password123"
    
    # Hash the password
    hashed_password = get_password_hash(password)
    print(f"Original password: {password}")
    print(f"Hashed password: {hashed_password}")
    
    # Verify the password
    is_valid = verify_password(password, hashed_password)
    print(f"Password verification result: {is_valid}")
    
    # Test with wrong password
    is_valid_wrong = verify_password("wrongpassword", hashed_password)
    print(f"Wrong password verification result: {is_valid_wrong}")

if __name__ == "__main__":
    test_password_hashing()