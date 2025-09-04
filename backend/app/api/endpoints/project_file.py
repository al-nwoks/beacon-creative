from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import logging
import time

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema
from app.auth.dependencies import get_current_active_user_dependency
from app.utils import resize_image_for_portfolio, image_to_base64
from app.utils.performance import log_performance_metrics

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
def read_files():
    return {"message": "Project files endpoint is working."}


@router.post("/upload-portfolio", response_model=UserSchema)
async def upload_portfolio_image(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user_dependency),
) -> UserSchema:
    """
    Upload a portfolio image with automatic resizing and conversion.
    """
    start_time = time.time()
    logger.info(f"Uploading portfolio image for user ID: {current_user.id}")
    logger.debug(f"File details: name={file.filename}, size={file.size}, content_type={file.content_type}")
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        logger.warning(f"Portfolio upload failed: Invalid file type {file.content_type} for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image",
        )
    
    # Read the file content
    contents = await file.read()
    logger.debug(f"File read successfully. Size: {len(contents)} bytes")
    
    # Check file size (50MB limit)
    if len(contents) > 50 * 1024 * 1024:
        logger.warning(f"Portfolio upload failed: File too large ({len(contents)} bytes) for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 50MB limit",
        )
    
    # Process the image (resize and convert to base64 for efficient handling)
    try:
        process_start = time.time()
        processed_image = resize_image_for_portfolio(contents)
        image_base64 = image_to_base64(processed_image)
        process_end = time.time()
        
        log_performance_metrics("portfolio_image_processing", process_start, process_end, {
            "original_size": len(contents),
            "processed_size": len(image_base64)
        })
        
        # Create the data URL for the image
        image_data_url = f"data:image/jpeg;base64,{image_base64}"
        logger.debug("Image processed successfully")
        
        # Add the image to the user's portfolio
        if current_user.portfolio_images is None:
            current_user.portfolio_images = []
        
        current_user.portfolio_images.append(image_data_url)
        logger.debug(f"Added image to portfolio. Total images: {len(current_user.portfolio_images)}")
        
        # Limit to 12 portfolio images
        if len(current_user.portfolio_images) > 12:
            removed_count = len(current_user.portfolio_images) - 12
            current_user.portfolio_images = current_user.portfolio_images[-12:]
            logger.info(f"Portfolio limit exceeded. Removed {removed_count} oldest images")
        
    except Exception as e:
        logger.error(f"Error processing portfolio image for user {current_user.id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing image: {str(e)}",
        )
    
    try:
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        logger.error(f"Error saving portfolio image to database for user {current_user.id}: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving portfolio image to database: {str(e)}",
        )
    
    end_time = time.time()
    log_performance_metrics("upload_portfolio_image", start_time, end_time, {
        "file_size": len(contents),
        "portfolio_size": len(current_user.portfolio_images) if current_user.portfolio_images else 0
    })
    logger.info(f"Portfolio image uploaded successfully for user ID: {current_user.id}")
    return current_user


@router.delete("/portfolio/{image_index}", response_model=UserSchema)
async def delete_portfolio_image(
    *,
    image_index: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user_dependency),
) -> UserSchema:
    """
    Delete a portfolio image by index.
    """
    start_time = time.time()
    logger.info(f"Deleting portfolio image at index {image_index} for user ID: {current_user.id}")
    
    if current_user.portfolio_images is None or image_index < 0 or image_index >= len(current_user.portfolio_images):
        logger.warning(f"Portfolio image deletion failed: Invalid index {image_index} for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image index",
        )
    
    # Remove the image at the specified index
    removed_image = current_user.portfolio_images.pop(image_index)
    logger.debug(f"Removed image at index {image_index}. Remaining images: {len(current_user.portfolio_images)}")
    
    try:
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        logger.error(f"Error saving portfolio image deletion to database for user {current_user.id}: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving portfolio image deletion to database: {str(e)}",
        )
    
    end_time = time.time()
    log_performance_metrics("delete_portfolio_image", start_time, end_time)
    logger.info(f"Portfolio image deleted successfully for user ID: {current_user.id}")
    return current_user
