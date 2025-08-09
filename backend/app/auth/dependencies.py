import logging
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.auth.middleware import (
    get_current_user,
    get_current_active_user,
    get_current_creative_user,
    get_current_client_user
)

logger = logging.getLogger(__name__)

# Export the dependency functions for backward compatibility
# These now use the new middleware system which can support multiple providers

def get_current_user_dependency(
    user: User = Depends(get_current_user)
) -> User:
    """
    Get the current authenticated user
    """
    return user


def get_current_active_user_dependency(
    user: User = Depends(get_current_active_user)
) -> User:
    """
    Get the current active user
    """
    return user


def get_current_creative_user_dependency(
    user: User = Depends(get_current_creative_user)
) -> User:
    """
    Get the current creative user
    """
    return user


def get_current_client_user_dependency(
    user: User = Depends(get_current_client_user)
) -> User:
    """
    Get the current client user
    """
    return user
