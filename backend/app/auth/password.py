from passlib.context import CryptContext

# Create password context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hash a password
    """
    # Truncate password to 72 bytes to comply with bcrypt limit
    if len(password) > 72:
        password = password[:72]
    return pwd_context.hash(password)
