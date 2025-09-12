from fastapi import Depends, HTTPException, status, WebSocket
from sqlalchemy.orm import Session
from typing import Optional
import logging

from app.db.database import get_db
from app.models.user import User
from app.auth.jwt import decode_access_token
from app.core.config import settings

logger = logging.getLogger(__name__)

# For HTTP requests
def get_current_user(db: Session = Depends(get_db), token: str = None) -> User:
    """Get current user from JWT token in HTTP requests"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = decode_access_token(token)
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_client_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active client user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    if current_user.role != "client":
        raise HTTPException(status_code=403, detail="Client access required")
    return current_user

def get_current_creative_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active creative user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    if current_user.role != "creative":
        raise HTTPException(status_code=403, detail="Creative access required")
    return current_user

def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active admin user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# For WebSocket connections
async def get_current_user_from_websocket(websocket: WebSocket, db: Session) -> Optional[User]:
    """Get current user from WebSocket connection"""
    try:
        # Get token from query parameters or headers
        token = websocket.query_params.get("token")
        if not token:
            # Try to get token from Authorization header
            auth_header = websocket.headers.get("authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header[7:]  # Remove "Bearer " prefix
        
        if not token:
            logger.warning("No authentication token provided in WebSocket connection")
            return None
            
        try:
            payload = decode_access_token(token)
            user_id: int = payload.get("sub")
            if user_id is None:
                logger.warning("Invalid token payload in WebSocket connection")
                return None
        except Exception as e:
            logger.warning(f"Token validation failed in WebSocket connection: {e}")
            return None
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            logger.warning(f"User {user_id} not found in WebSocket connection")
            return None
            
        if not user.is_active:
            logger.warning(f"Inactive user {user_id} attempted WebSocket connection")
            return None
            
        return user
        
    except Exception as e:
        logger.error(f"Error authenticating WebSocket connection: {e}")
        return None

# Dependency functions for FastAPI routes
get_db_dependency = Depends(get_db)
get_current_user_dependency = Depends(get_current_user)
get_current_active_user_dependency = Depends(get_current_active_user)
get_current_client_user_dependency = Depends(get_current_client_user)
get_current_creative_user_dependency = Depends(get_current_creative_user)
get_current_admin_user_dependency = Depends(get_current_admin_user)
