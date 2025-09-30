from typing import Any, List, Optional
import uuid
from datetime import datetime
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.database import get_db
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import (
    Notification as NotificationSchema,
    NotificationCreate,
    NotificationUpdate,
    NotificationList
)
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=NotificationList)
def get_notifications(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    page: int = 1,
    limit: int = 50,
    read: Optional[bool] = None,
) -> Any:
    """
    Get notifications for the current user with pagination.
    """
    logger.info(f"Fetching notifications for user ID: {current_user.id}")
    logger.debug(f"Filter parameters: page={page}, limit={limit}, read={read}")
    
    skip = (page - 1) * limit
    
    # Base query - notifications for current user
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    
    # Filter by read status if specified
    if read is not None:
        query = query.filter(Notification.read == read)
    
    # Get total count
    total = query.count()
    
    # Order by creation time (newest first) and apply pagination
    items = query.order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()
    
    logger.info(f"Found {len(items)} notifications (total: {total}) for user ID: {current_user.id}")
    return NotificationList(
        items=items,
        total=total,
        page=page,
        pageSize=limit
    )

@router.post("/", response_model=NotificationSchema)
async def create_notification(
    *,
    db: Session = Depends(get_db),
    notification_in: NotificationCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create a new notification.
    """
    logger.info(f"Creating notification for user ID: {notification_in.user_id}")
    logger.debug(f"Notification data: title={notification_in.title}, body_length={len(notification_in.body) if notification_in.body else 0}")
    
    # Only allow users to create notifications for themselves
    if notification_in.user_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to create notification for user {notification_in.user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Create new notification
    db_notification = Notification(
        user_id=notification_in.user_id,
        title=notification_in.title,
        body=notification_in.body,
        read=notification_in.read or False,
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    
    # Broadcast new notification via WebSocket
    if ws_manager:
        try:
            await ws_manager.broadcast_to_user(
                str(db_notification.user_id),
                {
                    "type": "notification",
                    "notification": {
                        "id": str(db_notification.id),
                        "title": db_notification.title,
                        "body": db_notification.body,
                        "read": db_notification.read,
                        "created_at": db_notification.created_at.isoformat()
                    }
                }
            )
        except Exception as e:
            logger.error(f"Failed to broadcast notification via WebSocket: {str(e)}")
    
    logger.info(f"Notification created successfully with ID: {db_notification.id} for user ID: {db_notification.user_id}")
    return db_notification

@router.put("/{notification_id}/read", response_model=NotificationSchema)
def mark_notification_as_read(
    *,
    db: Session = Depends(get_db),
    notification_id: str,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Mark a notification as read.
    """
    logger.info(f"Marking notification {notification_id} as read for user ID: {current_user.id}")
    
    notification_id_uuid = uuid.UUID(notification_id)
    notification = db.query(Notification).filter(
        Notification.id == notification_id_uuid,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        logger.warning(f"Notification {notification_id} not found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    
    # Mark as read
    notification.read = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    logger.info(f"Notification {notification_id} marked as read for user ID: {current_user.id}")
    return notification

@router.delete("/{notification_id}", response_model=NotificationSchema)
def delete_notification(
    *,
    db: Session = Depends(get_db),
    notification_id: str,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete a notification.
    """
    logger.info(f"Deleting notification {notification_id} for user ID: {current_user.id}")
    
    notification_id_uuid = uuid.UUID(notification_id)
    notification = db.query(Notification).filter(
        Notification.id == notification_id_uuid,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        logger.warning(f"Notification {notification_id} not found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    
    db.delete(notification)
    db.commit()
    
    logger.info(f"Notification {notification_id} deleted for user ID: {current_user.id}")
    return notification

@router.put("/read-all", response_model=dict)
def mark_all_notifications_as_read(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Mark all notifications for the current user as read.
    """
    logger.info(f"Marking all notifications as read for user ID: {current_user.id}")
    
    # Update all unread notifications for the current user
    updated_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.read == False
    ).update({Notification.read: True})
    
    db.commit()
    
    logger.info(f"Marked {updated_count} notifications as read for user ID: {current_user.id}")
    return {"message": f"Marked {updated_count} notifications as read", "count": updated_count}