from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from app.models.user import User
from sqlalchemy.orm import Session


class AuthProvider(ABC):
    """Base class for authentication providers"""
    
    @abstractmethod
    async def authenticate(self, db: Session, credentials: Dict[str, Any]) -> Optional[User]:
        """Authenticate a user with the given credentials"""
        pass
    
    @abstractmethod
    async def get_user_by_token(self, db: Session, token: str) -> Optional[User]:
        """Get a user by authentication token"""
        pass
    
    @abstractmethod
    async def create_token(self, user: User) -> str:
        """Create an authentication token for a user"""
        pass
    
    @abstractmethod
    async def validate_token(self, token: str) -> bool:
        """Validate an authentication token"""
        pass