import logging
import uuid
from typing import Any, List, Optional
import time

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import or_, and_, desc, func
from sqlalchemy.orm import Session, aliased

from app.db.database import get_db
from app.models.user import User
from app.models.message import Message
from app.models.notification import Notification
from app.models.gig import Gig
from app.models.application import Application
from app.schemas.message import MessageCreate, MessageUpdate, MessageWithUsers, Conversation
from app.auth.dependencies import get_current_active_user_dependency
from app.utils.performance import log_performance_metrics, log_query_performance

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=MessageWithUsers)
def create_message(
    *,
    db: Session = Depends(get_db),
    message_in: MessageCreate,
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Create a new message.
    """
    start_time = time.time()
    logger.info(f"Creating message from user ID: {current_user.id} to recipient ID: {message_in.recipient_id}")
    logger.debug(f"Message data: content_length={len(message_in.content)}, gig_id={message_in.gig_id}, application_id={message_in.application_id}")
    
    # Validate recipient_id
    try:
        recipient_id_int = int(message_in.recipient_id)
    except ValueError:
        logger.warning(f"Invalid recipient_id format: {message_in.recipient_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid recipient ID format",
        )
    
    # Check if recipient exists
    recipient = db.query(User).filter(User.id == recipient_id_int).first()
    if not recipient:
        logger.warning(f"Message creation failed: Recipient {recipient_id_int} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found",
        )
    
    # Check if recipient is not the sender
    if recipient_id_int == current_user.id:
        logger.warning(f"Message creation failed: User {current_user.id} attempted to message themselves")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send message to yourself",
        )
    
    # If gig_id is provided, check if it exists and if both users are involved
    gig_id_uuid = None
    if message_in.gig_id:
        try:
            gig_id_uuid = uuid.UUID(message_in.gig_id)
        except ValueError:
            logger.warning(f"Invalid gig ID format: {message_in.gig_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid gig ID format",
            )
        
        gig = db.query(Gig).filter(Gig.id == gig_id_uuid).first()
        if not gig:
            logger.warning(f"Message creation failed: Gig {message_in.gig_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gig not found",
            )
        
        # Check if both users are involved in the gig
        if (gig.client_id != current_user.id and gig.hired_creative_id != current_user.id) or \
           (gig.client_id != recipient.id and gig.hired_creative_id != recipient.id):
            logger.warning(f"Message creation failed: Users {current_user.id} and {recipient_id_int} not both involved in gig {message_in.gig_id}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Both users must be involved in the gig",
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
        
        # Get the gig
        gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
        
        # Check if both users are involved in the application
        if (application.creative_id != current_user.id and gig.client_id != current_user.id) or \
           (application.creative_id != recipient.id and gig.client_id != recipient.id):
            logger.warning(f"Message creation failed: Users {current_user.id} and {recipient_id_int} not both involved in application {message_in.application_id}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Both users must be involved in the application",
            )
    
    # Create the message
    db_message = Message(
        sender_id=current_user.id,
        recipient_id=recipient_id_int,
        content=message_in.content,
        gig_id=gig_id_uuid,
        application_id=application_id_uuid,
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Create notification for recipient
    notification = Notification(
        user_id=recipient_id_int,
        type="message",
        title="New Message",
        message=f"{current_user.first_name} {current_user.last_name} sent you a message",
        related_entity_type="message",
        related_entity_id=db_message.id,
    )
    db.add(notification)
    db.commit()
    
    end_time = time.time()
    log_performance_metrics("create_message", start_time, end_time)
    
    logger.info(f"Message created successfully with ID: {db_message.id}")
    return db_message


@router.get("/", response_model=List[MessageWithUsers])
def get_messages(
    *,
    db: Session = Depends(get_db),
    other_user_id: Optional[str] = None,
    gig_id: Optional[str] = None,
    application_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Get messages for the current user.
    Can filter by other user, gig, or application.
    """
    start_time = time.time()
    logger.info(f"Fetching messages for user ID: {current_user.id}")
    logger.debug(f"Filter parameters: other_user_id={other_user_id}, gig_id={gig_id}, application_id={application_id}, skip={skip}, limit={limit}")
    
    # Build the query
    query = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.recipient_id == current_user.id
        )
    )
    
    # Filter by other user if provided
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
                and_(Message.sender_id == current_user.id, Message.recipient_id == other_user_id_int),
                and_(Message.sender_id == other_user_id_int, Message.recipient_id == current_user.id)
            )
        )
    
    if gig_id:
        try:
            gig_id_uuid = uuid.UUID(gig_id)
        except ValueError:
            logger.warning(f"Invalid gig_id format: {gig_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid gig ID format",
            )
        
        query = query.filter(Message.gig_id == gig_id_uuid)
    
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
    
    # Order by created_at descending and apply pagination
    query = query.order_by(desc(Message.created_at)).offset(skip).limit(limit)
    
    query_start = time.time()
    messages = query.all()
    query_end = time.time()
    log_query_performance("SELECT", "complex", query_end - query_start, len(messages))
    
    # Mark messages as read if they are received by the current user
    for message in messages:
        if message.recipient_id == current_user.id and not message.is_read:
            message.is_read = True
            db.add(message)
    
    if messages:
        db.commit()
    
    logger.info(f"Found {len(messages)} messages for user {current_user.id}")
    
    end_time = time.time()
    log_performance_metrics("get_messages", start_time, end_time, {
        "message_count": len(messages),
        "skip": skip,
        "limit": limit
    })
    return messages


@router.get("/conversations", response_model=List[Conversation])
def get_conversations(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Get conversation summaries for the current user.
    """
    start_time = time.time()
    logger.info(f"Fetching conversations for user ID: {current_user.id}")
    
    # Create aliases for sender and recipient users
    Sender = aliased(User)
    Recipient = aliased(User)
    
    # Get the latest message for each conversation
    latest_messages_subquery = (
        db.query(
            func.greatest(Message.sender_id, Message.recipient_id).label('user1'),
            func.least(Message.sender_id, Message.recipient_id).label('user2'),
            func.max(Message.created_at).label('max_created_at')
        )
        .filter(or_(Message.sender_id == current_user.id, Message.recipient_id == current_user.id))
        .group_by(
            func.greatest(Message.sender_id, Message.recipient_id),
            func.least(Message.sender_id, Message.recipient_id)
        )
        .subquery()
    )
    
    # Get the actual latest messages with user info
    latest_messages_query = (
        db.query(Message, Sender, Recipient)
        .join(Sender, Message.sender_id == Sender.id)
        .join(Recipient, Message.recipient_id == Recipient.id)
        .join(
            latest_messages_subquery,
            and_(
                func.greatest(Message.sender_id, Message.recipient_id) == latest_messages_subquery.c.user1,
                func.least(Message.sender_id, Message.recipient_id) == latest_messages_subquery.c.user2,
                Message.created_at == latest_messages_subquery.c.max_created_at
            )
        )
        .filter(or_(Message.sender_id == current_user.id, Message.recipient_id == current_user.id))
    )
    
    query_start = time.time()
    latest_messages_result = latest_messages_query.all()
    query_end = time.time()
    log_query_performance("SELECT", "complex", query_end - query_start, len(latest_messages_result))
    
    # Get unread counts for each conversation
    unread_counts = {}
    for message, sender, recipient in latest_messages_result:
        other_user_id = sender.id if message.recipient_id == current_user.id else recipient.id
        if other_user_id not in unread_counts:
            unread_count = db.query(Message).filter(
                Message.recipient_id == current_user.id,
                or_(Message.sender_id == sender.id, Message.sender_id == recipient.id),
                Message.is_read == False
            ).count()
            unread_counts[other_user_id] = unread_count
    
    # Build conversation summaries
    conversations = []
    for message, sender, recipient in latest_messages_result:
        # Determine the other user in the conversation
        if message.sender_id == current_user.id:
            other_user = recipient
        else:
            other_user = sender
        
        conversation = Conversation(
            user=other_user,
            last_message=message,
            unread_count=unread_counts.get(other_user.id, 0),
            updated_at=message.created_at
        )
        conversations.append(conversation)
    
    # Sort conversations by updated_at descending
    conversations.sort(key=lambda x: x.updated_at, reverse=True)
    
    logger.info(f"Found {len(conversations)} conversations for user {current_user.id}")
    
    end_time = time.time()
    log_performance_metrics("get_conversations", start_time, end_time, {
        "conversation_count": len(conversations)
    })
    return conversations


@router.get("/{message_id}", response_model=MessageWithUsers)
def get_message(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Get a specific message by ID.
    """
    logger.info(f"Fetching message {message_id} for user {current_user.id}")
    
    # Convert string ID to UUID
    try:
        message_id_uuid = uuid.UUID(message_id)
    except ValueError:
        logger.warning(f"Invalid message ID format: {message_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    # Get the message
    message = db.query(Message).filter(Message.id == message_id_uuid).first()
    if not message:
        logger.warning(f"Message {message_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    # Check if user is sender or recipient
    if message.sender_id != current_user.id and message.recipient_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to access message {message_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this message",
        )
    
    # Mark as read if recipient
    if message.recipient_id == current_user.id and not message.is_read:
        message.is_read = True
        db.add(message)
        db.commit()
        logger.info(f"Message {message_id} marked as read for user {current_user.id}")
    
    logger.info(f"Message {message_id} found for user {current_user.id}")
    return message


@router.put("/{message_id}", response_model=MessageWithUsers)
def update_message(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    message_in: MessageUpdate,
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Update a message (mark as read).
    """
    logger.info(f"Updating message {message_id} for user {current_user.id}")
    logger.debug(f"Update data: {message_in.dict(exclude_unset=True)}")
    
    # Convert string ID to UUID
    try:
        message_id_uuid = uuid.UUID(message_id)
    except ValueError:
        logger.warning(f"Invalid message ID format: {message_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    # Get the message
    message = db.query(Message).filter(Message.id == message_id_uuid).first()
    if not message:
        logger.warning(f"Message {message_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    # Check if user is recipient
    if message.recipient_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to update message {message_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the recipient can update this message",
        )
    
    # Update message attributes
    for field, value in message_in.dict(exclude_unset=True).items():
        setattr(message, field, value)
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    logger.info(f"Message {message_id} updated successfully by user {current_user.id}")
    return message


@router.put("/{message_id}/read", response_model=MessageWithUsers)
def mark_message_as_read(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Mark a message as read.
    """
    logger.info(f"Marking message {message_id} as read for user {current_user.id}")
    
    # Convert string ID to UUID
    try:
        message_id_uuid = uuid.UUID(message_id)
    except ValueError:
        logger.warning(f"Invalid message ID format: {message_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    # Get the message
    message = db.query(Message).filter(Message.id == message_id_uuid).first()
    if not message:
        logger.warning(f"Message {message_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    # Check if user is recipient
    if message.recipient_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to mark message {message_id} as read without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the recipient can mark this message as read",
        )
    
    # Mark as read
    if not message.is_read:
        message.is_read = True
        db.add(message)
        db.commit()
        db.refresh(message)
        logger.info(f"Message {message_id} marked as read for user {current_user.id}")
    else:
        logger.info(f"Message {message_id} was already marked as read for user {current_user.id}")
    
    return message
