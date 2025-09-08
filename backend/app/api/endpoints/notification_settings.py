from typing import Any
import logging
import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.notification_setting import NotificationSetting
from app.schemas.notification_setting import (
    NotificationSetting as NotificationSettingSchema,
    NotificationSettingCreate,
    NotificationSettingUpdate
)
from app.auth.dependencies import get_current_active_user_dependency
from app.utils.performance import log_performance_metrics, log_query_performance

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/me", response_model=NotificationSettingSchema)
def get_current_user_notification_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user_dependency),
) -> Any:
    """
    Get current user's notification settings.
    If no settings exist, create default settings.
    """
    start_time = time.time()
    logger.info(f"Fetching notification settings for user ID: {current_user.id}")
    
    # Get notification settings through the relationship
    from sqlalchemy.orm import joinedload
    # Get notification settings through the relationship with join loading
    notification_setting = current_user.notification_settings
    
    # If no settings exist, create default settings
    if not notification_setting:
        logger.info(f"No notification settings found for user {current_user.id}, creating defaults")
        notification_setting = NotificationSetting(user_id=current_user.id)
        db.add(notification_setting)
        db.commit()
        db.refresh(notification_setting)
        # Update the relationship
        current_user.notification_settings = notification_setting
    
    end_time = time.time()
    log_performance_metrics("get_notification_settings", start_time, end_time)
    logger.info(f"Notification settings fetched successfully for user ID: {current_user.id}")
    return notification_setting


@router.post("/", response_model=NotificationSettingSchema)
def create_notification_settings(
    *,
    db: Session = Depends(get_db),
    notification_setting_in: NotificationSettingCreate,
    current_user: User = Depends(get_current_active_user_dependency),
) -> Any:
    """
    Create notification settings for the current user.
    """
    start_time = time.time()
    logger.info(f"Creating notification settings for user ID: {current_user.id}")
    logger.debug(f"Settings data: {notification_setting_in.dict()}")
    
    # Check if notification settings already exist for the user
    # Get notification settings through the relationship
    existing_setting = current_user.notification_settings
    
    if existing_setting:
        logger.warning(f"Notification settings already exist for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Notification settings already exist for this user",
        )
    
    # Create new notification settings
    notification_setting = NotificationSetting(
        user_id=current_user.id,
        **notification_setting_in.dict()
    )
    db.add(notification_setting)
    db.commit()
    db.refresh(notification_setting)
    
    end_time = time.time()
    log_performance_metrics("create_notification_settings", start_time, end_time)
    logger.info(f"Notification settings created successfully for user ID: {current_user.id}")
    return notification_setting


@router.put("/me", response_model=NotificationSettingSchema)
def update_current_user_notification_settings(
    *,
    db: Session = Depends(get_db),
    notification_setting_in: NotificationSettingUpdate,
    current_user: User = Depends(get_current_active_user_dependency),
) -> Any:
    """
    Update current user's notification settings.
    """
    start_time = time.time()
    logger.info(f"Updating notification settings for user ID: {current_user.id}")
    logger.debug(f"Update data: {notification_setting_in.dict(exclude_unset=True)}")
    
    # Get existing notification settings
    # Get notification settings through the relationship
    notification_setting = current_user.notification_settings
    
    # If no settings exist, create new ones
    if not notification_setting:
        logger.info(f"No notification settings found for user {current_user.id}, creating new ones")
        notification_setting = NotificationSetting(
            user_id=current_user.id,
            **notification_setting_in.dict(exclude_unset=True)
        )
        db.add(notification_setting)
    else:
        # Update existing settings
        for field, value in notification_setting_in.dict(exclude_unset=True).items():
            setattr(notification_setting, field, value)
        db.add(notification_setting)
    
    db.commit()
    db.refresh(notification_setting)
    
    end_time = time.time()
    log_performance_metrics("update_notification_settings", start_time, end_time)
    logger.info(f"Notification settings updated successfully for user ID: {current_user.id}")
    return notification_setting


@router.delete("/me", response_model=NotificationSettingSchema)
def delete_current_user_notification_settings(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user_dependency),
) -> Any:
    """
    Delete current user's notification settings.
    """
    start_time = time.time()
    logger.info(f"Deleting notification settings for user ID: {current_user.id}")
    
    # Get existing notification settings
    # Get notification settings through the relationship
    notification_setting = current_user.notification_settings
    
    if not notification_setting:
        logger.warning(f"No notification settings found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No notification settings found for this user",
        )
    
    db.delete(notification_setting)
    db.commit()
    
    end_time = time.time()
    log_performance_metrics("delete_notification_settings", start_time, end_time)
    logger.info(f"Notification settings deleted successfully for user ID: {current_user.id}")
    return notification_setting