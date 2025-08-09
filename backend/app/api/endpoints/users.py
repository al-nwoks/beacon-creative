from typing import Any, List
import logging

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate
from app.auth.dependencies import (
    get_current_active_user_dependency,
    get_current_user_dependency
)

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def get_current_user_info(
    current_user: User = Depends(get_current_active_user_dependency),
) -> Any:
    """
    Get current user information.
    """
    logger.info(f"Fetching current user info for user ID: {current_user.id}")
    logger.debug(f"User details: email={current_user.email}, role={current_user.role}")
    return current_user


@router.put("/me", response_model=UserSchema)
def update_current_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user_dependency),
) -> Any:
    """
    Update current user information.
    """
    logger.info(f"Updating user info for user ID: {current_user.id}")
    logger.debug(f"Update data: {user_in.dict(exclude_unset=True)}")
    
    # Check if email is being updated and if it's already taken
    if user_in.email is not None and user_in.email != current_user.email:
        user = db.query(User).filter(User.email == user_in.email).first()
        if user:
            logger.warning(f"User update failed: Email {user_in.email} already registered for user ID: {current_user.id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
    
    # Update user attributes
    for field, value in user_in.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    logger.info(f"User info updated successfully for user ID: {current_user.id}")
    return current_user


@router.post("/upload-avatar", response_model=UserSchema)
async def upload_avatar(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user_dependency),
) -> Any:
    """
    Upload a profile avatar.
    """
    # TODO: Implement file upload to S3 or other storage
    # For now, we'll just update the URL with a placeholder
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image",
        )
    
    # Update user with placeholder URL
    # In a real implementation, we would upload the file and get the URL
    current_user.profile_image_url = f"https://example.com/avatars/{current_user.id}"
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/{user_id}", response_model=UserSchema)
def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user_dependency),
) -> Any:
    """
    Get a specific user by id.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
