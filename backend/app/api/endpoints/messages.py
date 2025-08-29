from typing import Any, List, Optional
import uuid
from datetime import datetime
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, func

from app.db.database import get_db
from app.models.user import User
from app.models.message import Message
from app.models.project import Project
from app.models.application import Application
from app.schemas.message import (
    Message as MessageSchema,
    MessageCreate,
    MessageUpdate,
    MessageWithSender,
    MessageWithUsers,
    Conversation
)
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=MessageSchema)
def create_message(
    *,
    db: Session = Depends(get_db),
    message_in: MessageCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create a new message.
    """
    logger.info(f"Creating message from user ID: {current_user.id} to recipient ID: {message_in.recipient_id}")
    logger.debug(f"Message data: content_length={len(message_in.content)}, project_id={message_in.project_id}, application_id={message_in.application_id}")
    
    # Convert recipient_id to integer (user IDs are integers, not UUIDs)
    try:
        recipient_id_int = int(message_in.recipient_id)
    except ValueError:
        logger.warning(f"Invalid recipient ID format: {message_in.recipient_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid recipient ID format",
        )
    
    recipient = db.query(User).filter(User.id == recipient_id_int).first()
    if not recipient:
        logger.warning(f"Message creation failed: Recipient {recipient_id_int} not found for sender {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found",
        )
    
    # If project_id is provided, check if it exists and if both users are involved
    project_id_uuid = None
    if message_in.project_id:
        try:
            project_id_uuid = uuid.UUID(message_in.project_id)
        except ValueError:
            logger.warning(f"Invalid project ID format: {message_in.project_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid project ID format",
            )
        
        project = db.query(Project).filter(Project.id == project_id_uuid).first()
        if not project:
            logger.warning(f"Message creation failed: Project {message_in.project_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )
        
        # Check if both users are involved in the project
        if (project.client_id != current_user.id and project.hired_creative_id != current_user.id) or \
           (project.client_id != recipient.id and project.hired_creative_id != recipient.id):
            logger.warning(f"Message creation failed: Users {current_user.id} and {recipient_id_int} not both involved in project {message_in.project_id}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Both users must be involved in the project",
            )
    
    # If application_id is provided, check if it exists and if both users are involved
    application_id_uuid = None
    if message_in.application_id:
        try:
            application_id_uuid = uuid.UUID(message_in.application_id)
        except ValueError:
            logger.warning(f"Invalid application ID format: {message_in.application_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid application ID format",
            )
        
        application = db.query(Application).filter(Application.id == application_id_uuid).first()
        if not application:
            logger.warning(f"Message creation failed: Application {message_in.application_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )
        
        # Get the project
        project = db.query(Project).filter(Project.id == application.project_id).first()
        
        # Check if both users are involved in the application
        if (application.creative_id != current_user.id and project.client_id != current_user.id) or \
           (application.creative_id != recipient.id and project.client_id != recipient.id):
            logger.warning(f"Message creation failed: Users {current_user.id} and {recipient_id_int} not both involved in application {message_in.application_id}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Both users must be involved in the application",
            )
    
    # Create new message
    db_message = Message(
        sender_id=current_user.id,
        recipient_id=recipient_id_int,
        content=message_in.content,
        project_id=project_id_uuid,
        application_id=application_id_uuid,
        is_read=False
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    logger.info(f"Message created successfully with ID: {db_message.id} from user {current_user.id} to {recipient_id_int}")
    return db_message

@router.get("/", response_model=List[MessageWithSender])
def get_messages(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    other_user_id: Optional[str] = None,
    project_id: Optional[str] = None,
    application_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """
    Get messages with filters.
    """
    logger.info(f"Fetching messages for user ID: {current_user.id}")
    logger.debug(f"Filter parameters: other_user_id={other_user_id}, project_id={project_id}, application_id={application_id}, skip={skip}, limit={limit}")
    
    # Base query - messages where current user is sender or recipient
    query = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.recipient_id == current_user.id
        )
    )
    
    # Apply filters
    if other_user_id:
        try:
            other_user_id_int = int(other_user_id)
        except ValueError:
            logger.warning(f"Invalid other_user_id format: {other_user_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format",
            )
        
        query = query.filter(
            or_(
                and_(
                    Message.sender_id == current_user.id,
                    Message.recipient_id == other_user_id_int
                ),
                and_(
                    Message.sender_id == other_user_id_int,
                    Message.recipient_id == current_user.id
                )
            )
        )
    
    if project_id:
        try:
            project_id_uuid = uuid.UUID(project_id)
        except ValueError:
            logger.warning(f"Invalid project_id format: {project_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid project ID format",
            )
        
        query = query.filter(Message.project_id == project_id_uuid)
    
    if application_id:
        try:
            application_id_uuid = uuid.UUID(application_id)
        except ValueError:
            logger.warning(f"Invalid application_id format: {application_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid application ID format",
            )
        
        query = query.filter(Message.application_id == application_id_uuid)
    
    # Order by creation time (newest first) and apply pagination
    messages = query.order_by(desc(Message.created_at)).offset(skip).limit(limit).all()
    
    # Mark messages as read if current user is recipient
    read_count = 0
    for message in messages:
        if message.recipient_id == current_user.id and not message.is_read:
            message.is_read = True
            db.add(message)
            read_count += 1
    
    if read_count > 0:
        db.commit()
        logger.info(f"Marked {read_count} messages as read for user ID: {current_user.id}")
    
    logger.info(f"Found {len(messages)} messages for user ID: {current_user.id}")
    return messages

@router.get("/conversations", response_model=List[Conversation])
def get_conversations(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get all conversations for the current user.
    """
    logger.info(f"Fetching conversations for user ID: {current_user.id}")
    
    # This is a more complex query that would typically use raw SQL or complex ORM operations
    # For simplicity, we'll use a less efficient but functional approach
    
    # Get all users the current user has exchanged messages with
    user_ids = db.query(Message.sender_id).filter(Message.recipient_id == current_user.id).distinct().all()
    user_ids.extend(db.query(Message.recipient_id).filter(Message.sender_id == current_user.id).distinct().all())
    
    # Flatten and deduplicate the list
    user_ids = list(set([user_id[0] for user_id in user_ids if user_id[0] != current_user.id]))
    
    logger.debug(f"Found {len(user_ids)} conversation partners for user ID: {current_user.id}")
    
    conversations = []
    for user_id in user_ids:
        # Get the other user
        other_user = db.query(User).filter(User.id == user_id).first()
        if not other_user:
            continue
        
        # Get the latest message between the two users
        latest_message = db.query(Message).filter(
            or_(
                and_(
                    Message.sender_id == current_user.id,
                    Message.recipient_id == user_id
                ),
                and_(
                    Message.sender_id == user_id,
                    Message.recipient_id == current_user.id
                )
            )
        ).order_by(desc(Message.created_at)).first()
        
        # Count unread messages
        unread_count = db.query(func.count(Message.id)).filter(
            Message.sender_id == user_id,
            Message.recipient_id == current_user.id,
            Message.is_read == False
        ).scalar()
        
        # Create conversation object
        conversation = {
            "user": other_user,
            "last_message": latest_message,
            "unread_count": unread_count,
            "updated_at": latest_message.created_at if latest_message else None
        }
        
        conversations.append(conversation)
    
    # Sort by latest message time (handle None values)
    conversations.sort(key=lambda x: x["updated_at"] or datetime.min, reverse=True)
    
    logger.info(f"Returning {len(conversations)} conversations for user ID: {current_user.id}")
    return conversations

@router.get("/between/{other_user_id}", response_model=List[MessageWithUsers])
def get_messages_between_users(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    other_user_id: int,
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """
    Get messages between the current user and another specific user.
    """
    logger.info(f"Fetching messages between user ID: {current_user.id} and user ID: {other_user_id}")
    logger.debug(f"Pagination parameters: skip={skip}, limit={limit}")
    
    # Verify the other user exists
    other_user = db.query(User).filter(User.id == other_user_id).first()
    if not other_user:
        logger.warning(f"User {other_user_id} not found when fetching messages for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Get messages between the two users
    messages = db.query(Message).filter(
        or_(
            and_(
                Message.sender_id == current_user.id,
                Message.recipient_id == other_user_id
            ),
            and_(
                Message.sender_id == other_user_id,
                Message.recipient_id == current_user.id
            )
        )
    ).order_by(desc(Message.created_at)).offset(skip).limit(limit).all()
    
    # Mark messages as read if current user is recipient
    read_count = 0
    for message in messages:
        if message.recipient_id == current_user.id and not message.is_read:
            message.is_read = True
            db.add(message)
            read_count += 1
    
    if read_count > 0:
        db.commit()
        logger.info(f"Marked {read_count} messages as read for user ID: {current_user.id}")
    
    logger.info(f"Found {len(messages)} messages between user ID: {current_user.id} and user ID: {other_user_id}")
    return messages

@router.put("/{message_id}/read", response_model=MessageSchema)
def mark_message_as_read(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Mark a message as read.
    """
    logger.info(f"Marking message {message_id} as read for user ID: {current_user.id}")
    
    message_id_uuid = uuid.UUID(message_id)
    message = db.query(Message).filter(Message.id == message_id_uuid).first()
    if not message:
        logger.warning(f"Message {message_id} not found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    # Check if user is the recipient
    if message.recipient_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to mark message {message_id} as read (not recipient)")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Mark as read
    message.is_read = True
    db.add(message)
    db.commit()
    db.refresh(message)
    
    logger.info(f"Message {message_id} marked as read for user ID: {current_user.id}")
    return message
