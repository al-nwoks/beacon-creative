import logging
from typing import Optional
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.auth.providers.factory import get_provider
from app.auth.config import get_current_auth_provider

logger = logging.getLogger(__name__)

# Get the authentication provider based on settings
AUTH_PROVIDER_NAME = get_current_auth_provider()
auth_provider = get_provider(AUTH_PROVIDER_NAME)

# Security scheme for token authentication
security = HTTPBearer()


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security, use_cache=False),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user using the configured authentication provider.
    Supports both Bearer token in Authorization header and token in access_token cookie.
    """
    logger.debug(f"Authenticating user with token. Request path: {request.url.path}")
    logger.debug(f"Request headers: {dict(request.headers)}")
    logger.debug(f"Request cookies: {dict(request.cookies)}")
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Get token from Authorization header or cookie
    token = None
    if credentials:
        # Token from Authorization header
        token = credentials.credentials
        logger.debug("Using token from Authorization header")
    else:
        # Try to get token from cookie
        token = request.cookies.get("access_token")
        if token:
            logger.debug("Using token from access_token cookie")
        else:
            logger.debug("No token found in Authorization header or access_token cookie")
    
    if not token:
        logger.warning("No authentication token provided")
        raise credentials_exception
    
    try:
        user = await auth_provider.get_user_by_token(db, token)
        if user is None:
            logger.warning("Invalid token: User not found or inactive")
            raise credentials_exception
            
        logger.info(f"User authenticated successfully: {user.email} (ID: {user.id})")
        return user
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise credentials_exception


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get the current active user
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user


async def get_current_creative_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get the current creative user
    """
    logger.debug(f"Checking if user {current_user.id} is a creative user")
    
    if current_user.role != "creative":
        logger.warning(f"Access denied: User {current_user.id} is not a creative user (role: {current_user.role})")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a creative user"
        )
    
    logger.debug(f"User {current_user.id} authorized as creative")
    return current_user


async def get_current_client_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get the current client user
    """
    logger.debug(f"Checking if user {current_user.id} is a client user")
    
    if current_user.role != "client":
        logger.warning(f"Access denied: User {current_user.id} is not a client user (role: {current_user.role})")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a client user"
        )
    
    logger.debug(f"User {current_user.id} authorized as client")
    return current_user