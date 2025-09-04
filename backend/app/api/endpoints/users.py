from typing import Any, List
import logging
import time

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate
from app.auth.dependencies import (
    get_current_active_user_dependency,
    get_current_user_dependency
)
from app.utils import resize_image_for_avatar, image_to_base64
from app.utils.performance import log_performance_metrics, log_query_performance

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
    start_time = time.time()
    logger.info(f"Updating user info for user ID: {current_user.id}")
    logger.debug(f"Update data: {user_in.dict(exclude_unset=True)}")
    
    # Check if email is being updated and if it's already taken
    if user_in.email is not None and user_in.email != current_user.email:
        query_start = time.time()
        user = db.query(User).filter(User.email == user_in.email).first()
        query_end = time.time()
        log_query_performance("SELECT", "simple", query_end - query_start)
        
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
    
    end_time = time.time()
    log_performance_metrics("update_user", start_time, end_time)
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
    Upload a profile avatar with automatic resizing and conversion.
    """
    start_time = time.time()
    logger.info(f"Uploading avatar for user ID: {current_user.id}")
    logger.debug(f"File details: name={file.filename}, size={file.size}, content_type={file.content_type}")
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        logger.warning(f"Avatar upload failed: Invalid file type {file.content_type} for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image",
        )
    
    # Read the file content
    contents = await file.read()
    logger.debug(f"File read successfully. Size: {len(contents)} bytes")
    
    # Check file size (50MB limit)
    if len(contents) > 50 * 1024 * 1024:
        logger.warning(f"Avatar upload failed: File too large ({len(contents)} bytes) for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 50MB limit",
        )
    
    # Process the image (resize and convert to base64 for efficient handling)
    try:
        process_start = time.time()
        processed_image = resize_image_for_avatar(contents)
        image_base64 = image_to_base64(processed_image)
        process_end = time.time()
        
        log_performance_metrics("image_processing", process_start, process_end, {
            "original_size": len(contents),
            "processed_size": len(image_base64)
        })
        
        # For now, we'll store the base64 image directly in the database
        # In a production environment, you would upload to S3 or similar storage
        current_user.profile_image_url = f"data:image/jpeg;base64,{image_base64}"
        logger.debug("Image processed and URL set successfully")
    except Exception as e:
        logger.error(f"Error processing image for user {current_user.id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing image: {str(e)}",
        )
    
    try:
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        logger.error(f"Error saving avatar to database for user {current_user.id}: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving avatar to database: {str(e)}",
        )
    
    end_time = time.time()
    log_performance_metrics("upload_avatar", start_time, end_time, {
        "file_size": len(contents)
    })
    logger.info(f"Avatar uploaded successfully for user ID: {current_user.id}")
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
