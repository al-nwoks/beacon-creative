import logging
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from jose import JWTError

from app.models.user import User
from app.auth.providers.base import AuthProvider
from app.auth.password import verify_password
from app.auth.jwt import create_access_token, decode_access_token

logger = logging.getLogger(__name__)


class JWTAuthProvider(AuthProvider):
    """JWT-based authentication provider"""
    
    async def authenticate(self, db: Session, credentials: Dict[str, Any]) -> Optional[User]:
        """
        Authenticate a user with email and password
        """
        email = credentials.get("email")
        password = credentials.get("password")
        
        if not email or not password:
            return None
            
        logger.info(f"Authenticating user: {email}")
        
        # Find user by email
        user = db.query(User).filter(User.email == email).first()
        if not user:
            logger.warning(f"Authentication failed: User {email} not found")
            return None
        
        # Check if password is correct
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Authentication failed: Incorrect password for user {email}")
            return None
        
        # Check if user is active
        if not user.is_active:
            logger.warning(f"Authentication failed: User {email} is inactive")
            return None
            
        logger.info(f"User {email} authenticated successfully")
        return user
    
    async def get_user_by_token(self, db: Session, token: str) -> Optional[User]:
        """
        Get a user by JWT token
        """
        logger.debug("Authenticating user with JWT token")
        
        try:
            payload = decode_access_token(token)
            user_id: str = payload.get("sub")
            if user_id is None:
                logger.warning("Invalid token: No user ID in payload")
                return None
            logger.debug(f"Token decoded successfully for user ID: {user_id}")
        except JWTError as e:
            logger.warning(f"JWT decoding error: {str(e)}")
            return None
        
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            logger.warning(f"User not found for ID: {user_id}")
            return None
        
        if not user.is_active:
            logger.warning(f"Inactive user attempted access: {user_id}")
            return None
            
        logger.info(f"User authenticated successfully: {user.email} (ID: {user.id})")
        return user
    
    async def create_token(self, user: User) -> str:
        """
        Create a JWT token for a user
        """
        logger.debug(f"Creating access token for user: {user.email}")
        token = create_access_token(subject=str(user.id))
        logger.debug(f"Access token created successfully for user: {user.email}")
        return token
    
    async def validate_token(self, token: str) -> bool:
        """
        Validate a JWT token
        """
        try:
            decode_access_token(token)
            return True
        except JWTError:
            return False