import logging
from typing import Any
import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.notification_setting import NotificationSetting
from app.schemas.notification_setting import NotificationSetting, NotificationSettingUpdate
from app.auth.dependencies import get_current_active_user_dependency
from app.utils.performance import log_performance_metrics

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=NotificationSetting)
def get_notification_settings(
    db: Session = Depends(get_db),
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get notification settings for the current user.
    """
    start_time = time.time()
    logger.info(f"Fetching notification settings for user ID: {current_user.id}")
    
    # Get or create notification settings for the user
    notification_settings = db.query(NotificationSetting).filter(
        NotificationSetting.user_id == current_user.id
    ).first()
    
    # If no settings exist, create default ones
    if not notification_settings:
        logger.info(f"No notification settings found for user {current_user.id}, creating defaults")
        notification_settings = NotificationSetting(user_id=current_user.id)
        db.add(notification_settings)
        db.commit()
        db.refresh(notification_settings)
    
    end_time = time.time()
    log_performance_metrics("get_notification_settings", start_time, end_time)
    logger.info(f"Notification settings retrieved for user ID: {current_user.id}")
    return notification_settings


@router.put("/", response_model=NotificationSetting)
def update_notification_settings(
    *,
    db: Session = Depends(get_db),
    notification_settings_in: NotificationSettingUpdate,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Update notification settings for the current user.
    """
    start_time = time.time()
    logger.info(f"Updating notification settings for user ID: {current_user.id}")
    logger.debug(f"Update data: {notification_settings_in.dict(exclude_unset=True)}")
    
    # Get or create notification settings for the user
    notification_settings = db.query(NotificationSetting).filter(
        NotificationSetting.user_id == current_user.id
    ).first()
    
    # If no settings exist, create new ones
    if not notification_settings:
        logger.info(f"No notification settings found for user {current_user.id}, creating new ones")
        notification_settings = NotificationSetting(
            user_id=current_user.id,
            **notification_settings_in.dict(exclude_unset=True)
        )
        db.add(notification_settings)
    else:
        # Update existing settings
        update_data = notification_settings_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(notification_settings, field, value)
        db.add(notification_settings)
    
    db.commit()
    db.refresh(notification_settings)
    
    end_time = time.time()
    log_performance_metrics("update_notification_settings", start_time, end_time)
    logger.info(f"Notification settings updated for user ID: {current_user.id}")
    return notification_settings