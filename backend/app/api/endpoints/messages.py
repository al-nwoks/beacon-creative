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
from fastapi import UploadFile, File
from app.auth.dependencies import get_current_active_user_dependency
from app.utils.performance import log_performance_metrics, log_query_performance

# Import PostHog for server-side tracking
try:
    from app.utils.analytics import track_event
except ImportError:
    # Fallback if analytics module doesn't exist
    def track_event(user_id: str, event: str, properties: dict = None):
        pass

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=MessageWithUsers)
def create_message(
    *,
    db: Session = Depends(get_db),
    message_in: MessageCreate,
    current_user: User = get_current_active_user_dependency
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
    
    # Track message creation
    track_event(
        user_id=str(current_user.id),
        event="message_sent_server",
        properties={
            "message_id": str(db_message.id),
            "recipient_id": str(recipient_id_int),
            "message_length": len(message_in.content),
            "has_gig_context": bool(gig_id_uuid),
            "has_application_context": bool(application_id_uuid),
        }
    )
    
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
    current_user: User = get_current_active_user_dependency
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
    current_user: User = get_current_active_user_dependency
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
    current_user: User = get_current_active_user_dependency
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
    current_user: User = get_current_active_user_dependency
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


@router.put("/{message_id}/pin", response_model=MessageWithUsers)
def toggle_pin_message(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Toggle pin status of a message.
    Only the sender can pin/unpin their messages.
    """
    logger.info(f"Toggling pin status for message {message_id} by user {current_user.id}")
    
    try:
        message_id_uuid = uuid.UUID(message_id)
    except ValueError:
        logger.warning(f"Invalid message ID format: {message_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = db.query(Message).filter(Message.id == message_id_uuid).first()
    if not message:
        logger.warning(f"Message {message_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    if message.sender_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to pin message {message_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the sender can pin this message",
        )
    
    message.is_pinned = not message.is_pinned
    db.add(message)
    db.commit()
    db.refresh(message)
    
    logger.info(f"Message {message_id} pin status toggled to {message.is_pinned} by user {current_user.id}")
    return message

@router.put("/{message_id}/favorite", response_model=MessageWithUsers)
def toggle_favorite_message(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Toggle favorite status of a message.
    Only the recipient can favorite/unfavorite messages.
    """
    logger.info(f"Toggling favorite status for message {message_id} by user {current_user.id}")
    
    try:
        message_id_uuid = uuid.UUID(message_id)
    except ValueError:
        logger.warning(f"Invalid message ID format: {message_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = db.query(Message).filter(Message.id == message_id_uuid).first()
    if not message:
        logger.warning(f"Message {message_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    if message.recipient_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to favorite message {message_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the recipient can favorite this message",
        )
    
    message.is_favorite = not message.is_favorite
    db.add(message)
    db.commit()
    db.refresh(message)
    
    logger.info(f"Message {message_id} favorite status toggled to {message.is_favorite} by user {current_user.id}")
    return message

@router.put("/{message_id}/read", response_model=MessageWithUsers)
async def mark_message_as_read(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    current_user: User = get_current_active_user_dependency
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

        # Broadcast read receipt via WebSocket
        try:
            from app.ws.manager import ws_manager
            await ws_manager.broadcast_to_user(
                str(message.sender_id),
                {
                    "type": "message_read",
                    "message_id": str(message.id),
                    "read_at": datetime.utcnow().isoformat(),
                    "reader_id": current_user.id
                }
            )
        except Exception as e:
            logger.error(f"Failed to send read receipt via WebSocket: {str(e)}")
    else:
        logger.info(f"Message {message_id} was already marked as read for user {current_user.id}")
    
    return message


@router.get("/between/{other_user_id}", response_model=List[MessageWithUsers])
def get_messages_between_users(
    *,
    db: Session = Depends(get_db),
    other_user_id: str,
    skip: int = 0,
    limit: int = 50,
    order: str = "desc",  # "asc" for oldest first, "desc" for newest first
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get messages between the current user and another user with pagination.
    """
    start_time = time.time()
    logger.info(f"Fetching messages between user {current_user.id} and user {other_user_id}")
    logger.debug(f"Pagination: skip={skip}, limit={limit}, order={order}")
    
    # Validate other_user_id
    try:
        other_user_id_int = int(other_user_id)
    except ValueError:
        logger.warning(f"Invalid other_user_id format: {other_user_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format",
        )
    
    # Check if other user exists
    other_user = db.query(User).filter(User.id == other_user_id_int).first()
    if not other_user:
        logger.warning(f"Other user {other_user_id_int} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Build the query for messages between these two users
    query = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.recipient_id == other_user_id_int),
            and_(Message.sender_id == other_user_id_int, Message.recipient_id == current_user.id)
        )
    )
    
    # Apply ordering based on parameter
    if order.lower() == "asc":
        query = query.order_by(Message.created_at.asc())
    else:
        query = query.order_by(Message.created_at.desc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    query_start = time.time()
    messages = query.all()
    query_end = time.time()
    log_query_performance("SELECT", "complex", query_end - query_start, len(messages))
    
    # If we ordered by desc, reverse the list to show oldest first in UI
    if order.lower() == "desc":
        messages = list(reversed(messages))
    
    # Mark messages as read if they are received by the current user
    unread_count = 0
    for message in messages:
        if message.recipient_id == current_user.id and not message.is_read:
            message.is_read = True
            db.add(message)
            unread_count += 1
    
    if unread_count > 0:
        db.commit()
        logger.info(f"Marked {unread_count} messages as read")
    
    end_time = time.time()
    log_performance_metrics("get_messages_between_users", start_time, end_time, {
        "message_count": len(messages),
        "skip": skip,
        "limit": limit,
        "unread_marked": unread_count
    })
    
    logger.info(f"Found {len(messages)} messages between users {current_user.id} and {other_user_id_int}")
    return messages


@router.get("/search", response_model=List[MessageWithUsers])
def search_messages(
    *,
    db: Session = Depends(get_db),
    query: str = Query(None, min_length=1),
    sender_id: Optional[int] = None,
    recipient_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    has_files: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Advanced message search with multiple filters:
    - Text search (supports fuzzy matching)
    - Filter by sender/recipient
    - Date range filtering
    - File attachment filtering
    """
    start_time = time.time()
    logger.info(f"Advanced message search for user {current_user.id}")
    logger.debug(f"Search params: query={query}, sender={sender_id}, recipient={recipient_id}, start={start_date}, end={end_date}, has_files={has_files}")
    
    # Base query - only messages involving current user
    search_query = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.recipient_id == current_user.id
        )
    )
    
    # Text search (if provided)
    if query and query.strip():
        search_query = search_query.filter(
            or_(
                Message.content.ilike(f"%{query.strip()}%"),
                *[Message.content.ilike(f"%{word}%") for word in query.strip().split() if len(word) > 2]
            )
        )
    
    # Filter by sender
    if sender_id:
        search_query = search_query.filter(Message.sender_id == sender_id)
    
    # Filter by recipient
    if recipient_id:
        search_query = search_query.filter(Message.recipient_id == recipient_id)
    
    # Date range filtering
    if start_date:
        try:
            start_datetime = datetime.fromisoformat(start_date)
            search_query = search_query.filter(Message.created_at >= start_datetime)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid start date format. Use ISO format (YYYY-MM-DD)"
            )
    
    if end_date:
        try:
            end_datetime = datetime.fromisoformat(end_date)
            search_query = search_query.filter(Message.created_at <= end_datetime)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid end date format. Use ISO format (YYYY-MM-DD)"
            )
    
    # File attachment filtering
    if has_files is not None:
        if has_files:
            search_query = search_query.filter(
                Message.content.like('%"type":"file"%')
            )
        else:
            search_query = search_query.filter(
                Message.content.notlike('%"type":"file"%')
            )
    
    # Order by created_at descending and apply pagination
    search_query = search_query.order_by(desc(Message.created_at)).offset(skip).limit(limit)
    
    query_start = time.time()
    messages = search_query.all()
    query_end = time.time()
    log_query_performance("SELECT", "search", query_end - query_start, len(messages))
    
    # Mark messages as read if they are received by the current user
    for message in messages:
        if message.recipient_id == current_user.id and not message.is_read:
            message.is_read = True
            db.add(message)
    
    if messages:
        db.commit()
    
    end_time = time.time()
    log_performance_metrics("search_messages", start_time, end_time, {
        "message_count": len(messages),
        "has_query": bool(query),
        "filters_applied": sum([
            1 for x in [sender_id, recipient_id, start_date, end_date, has_files] if x is not None
        ])
    })
    
    logger.info(f"Found {len(messages)} messages matching search criteria")
    return messages


@router.post("/upload-file", response_model=MessageWithUsers)
async def upload_message_file(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    recipient_id: str,
    gig_id: str = None,
    application_id: str = None,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Upload a file and send it as a message.
    """
    start_time = time.time()
    logger.info(f"Uploading file message from user ID: {current_user.id} to recipient ID: {recipient_id}")
    logger.debug(f"File details: name={file.filename}, size={file.size}, content_type={file.content_type}")
    
    # Validate file
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    # Check file size (10MB limit for messages)
    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 10MB limit"
        )
    
    # Validate recipient_id
    try:
        recipient_id_int = int(recipient_id)
    except ValueError:
        logger.warning(f"Invalid recipient_id format: {recipient_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid recipient ID format",
        )
    
    # Check if recipient exists
    recipient = db.query(User).filter(User.id == recipient_id_int).first()
    if not recipient:
        logger.warning(f"File message creation failed: Recipient {recipient_id_int} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found",
        )
    
    # Check if recipient is not the sender
    if recipient_id_int == current_user.id:
        logger.warning(f"File message creation failed: User {current_user.id} attempted to message themselves")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send message to yourself",
        )
    
    # Read file content and upload to S3
    try:
        file_content = await file.read()
        
        # Upload to S3
        from app.services.s3_service import S3Service
        s3 = S3Service()
        file_url = await s3.upload_file(
            file_content=file_content,
            file_name=file.filename,
            content_type=file.content_type
        )
        
        # Create message content with file info
        message_content = json.dumps({
            "text": f"📎 {file.filename}",
            "file": {
                "type": "file",
                "filename": file.filename,
                "content_type": file.content_type,
                "size": len(file_content),
                "url": file_url
            }
        })
        
    except Exception as e:
        logger.error(f"Error processing file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing file: {str(e)}"
        )
    
    # Validate gig_id and application_id if provided (same logic as regular messages)
    gig_id_uuid = None
    if gig_id:
        try:
            gig_id_uuid = uuid.UUID(gig_id)
            gig = db.query(Gig).filter(Gig.id == gig_id_uuid).first()
            if not gig:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")
            
            if (gig.client_id != current_user.id and gig.hired_creative_id != current_user.id) or \
               (gig.client_id != recipient.id and gig.hired_creative_id != recipient.id):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Both users must be involved in the gig")
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid gig ID format")
    
    application_id_uuid = None
    if application_id:
        try:
            application_id_uuid = uuid.UUID(application_id)
            application = db.query(Application).filter(Application.id == application_id_uuid).first()
            if not application:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
            
            gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
            if (application.creative_id != current_user.id and gig.client_id != current_user.id) or \
               (application.creative_id != recipient.id and gig.client_id != recipient.id):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Both users must be involved in the application")
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid application ID format")
    
    # Create the message
    db_message = Message(
        sender_id=current_user.id,
        recipient_id=recipient_id_int,
        content=message_content,
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
        title="New File Message",
        message=f"{current_user.first_name} {current_user.last_name} sent you a file: {file.filename}",
        related_entity_type="message",
        related_entity_id=db_message.id,
    )
    db.add(notification)
    db.commit()
    
    end_time = time.time()
    log_performance_metrics("upload_message_file", start_time, end_time, {
        "file_size": len(file_content),
        "filename": file.filename
    })
    
    logger.info(f"File message created successfully with ID: {db_message.id}")
    
    # Track file message creation
    track_event(
        user_id=str(current_user.id),
        event="file_message_sent_server",
        properties={
            "message_id": str(db_message.id),
            "recipient_id": str(recipient_id_int),
            "file_name": file.filename,
            "file_size": len(file_content),
            "file_type": file.content_type,
        }
    )
    
    return db_message


@router.delete("/conversation/{other_user_id}")
def delete_conversation(
    *,
    db: Session = Depends(get_db),
    other_user_id: str,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Delete all messages in a conversation between current user and another user.
    """
    start_time = time.time()
    logger.info(f"Deleting conversation between user {current_user.id} and user {other_user_id}")
    
    # Validate other_user_id
    try:
        other_user_id_int = int(other_user_id)
    except ValueError:
        logger.warning(f"Invalid other_user_id format: {other_user_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format",
        )
    
    # Check if other user exists
    other_user = db.query(User).filter(User.id == other_user_id_int).first()
    if not other_user:
        logger.warning(f"Other user {other_user_id_int} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Delete all messages between these two users
    deleted_count = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.recipient_id == other_user_id_int),
            and_(Message.sender_id == other_user_id_int, Message.recipient_id == current_user.id)
        )
    ).delete()
    
    db.commit()
    
    end_time = time.time()
    log_performance_metrics("delete_conversation", start_time, end_time, {
        "deleted_messages": deleted_count
    })
    
    logger.info(f"Deleted {deleted_count} messages in conversation between users {current_user.id} and {other_user_id_int}")
    
    # Track conversation deletion
    track_event(
        user_id=str(current_user.id),
        event="conversation_deleted_server",
        properties={
            "other_user_id": str(other_user_id_int),
            "deleted_message_count": deleted_count,
        }
    )
    
    return {"message": f"Conversation deleted. {deleted_count} messages removed."}


@router.post("/{message_id}/reactions", response_model=MessageWithUsers)
async def add_reaction(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    emoji: str = Query(..., min_length=1, max_length=10),
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Add or remove a reaction to a message.
    """
    logger.info(f"Updating reaction '{emoji}' for message {message_id} by user {current_user.id}")
    
    try:
        message_id_uuid = uuid.UUID(message_id)
    except ValueError:
        logger.warning(f"Invalid message ID format: {message_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    message = db.query(Message).filter(Message.id == message_id_uuid).first()
    if not message:
        logger.warning(f"Message {message_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    # Initialize reactions if empty
    if not message.reactions:
        message.reactions = {}
    
    # Toggle reaction
    if emoji in message.reactions:
        if current_user.id in message.reactions[emoji]:
            # Remove reaction
            message.reactions[emoji].remove(current_user.id)
            if not message.reactions[emoji]:
                del message.reactions[emoji]
        else:
            # Add reaction
            message.reactions[emoji].append(current_user.id)
    else:
        # Add new reaction
        message.reactions[emoji] = [current_user.id]
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    logger.info(f"Reaction '{emoji}' updated for message {message_id}")
    return message

@router.post("/{message_id}/forward", response_model=MessageWithUsers)
async def forward_message(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    recipient_id: int,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Forward a message to another user.
    """
    logger.info(f"Forwarding message {message_id} to user {recipient_id} by {current_user.id}")
    
    # Validate message ID
    try:
        message_id_uuid = uuid.UUID(message_id)
    except ValueError:
        logger.warning(f"Invalid message ID format: {message_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID format",
        )
    
    # Get original message
    original_message = db.query(Message).filter(Message.id == message_id_uuid).first()
    if not original_message:
        logger.warning(f"Message {message_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    # Check if user has permission to forward (must be sender or recipient)
    if (original_message.sender_id != current_user.id and
        original_message.recipient_id != current_user.id):
        logger.warning(f"User {current_user.id} not authorized to forward message {message_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to forward this message",
        )
    
    # Validate recipient
    recipient = db.query(User).filter(User.id == recipient_id).first()
    if not recipient:
        logger.warning(f"Recipient {recipient_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found",
        )
    
    if recipient_id == current_user.id:
        logger.warning(f"User {current_user.id} attempted to forward to themselves")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot forward to yourself",
        )
    
    # Create forwarded message
    forwarded_message = Message(
        sender_id=current_user.id,
        recipient_id=recipient_id,
        content=f"(Forwarded) {original_message.content}",
        forwarded_from_id=original_message.id
    )
    
    db.add(forwarded_message)
    db.commit()
    db.refresh(forwarded_message)
    
    # Create notification for recipient
    notification = Notification(
        user_id=recipient_id,
        type="message",
        title="New Forwarded Message",
        message=f"{current_user.first_name} forwarded you a message",
        related_entity_type="message",
        related_entity_id=forwarded_message.id
    )
    db.add(notification)
    db.commit()
    
    logger.info(f"Message {message_id} forwarded to {recipient_id} as {forwarded_message.id}")
    return forwarded_message

@router.delete("/{message_id}")
async def delete_message(
    *,
    db: Session = Depends(get_db),
    message_id: str,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Delete a specific message (only sender can delete).
    """
    start_time = time.time()
    logger.info(f"Deleting message {message_id} by user {current_user.id}")
    
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
        logger.warning(f"Message {message_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )
    
    # Check if user is the sender
    if message.sender_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to delete message {message_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the sender can delete this message",
        )
    
    # Delete the message and any associated files
    try:
        # Check if message contains a file
        import json
        content = json.loads(message.content)
        if 'file' in content and 'url' in content['file']:
            from app.services.s3_service import S3Service
            s3 = S3Service()
            await s3.delete_file(content['file']['url'])
            
        db.delete(message)
        db.commit()
    except Exception as e:
        logger.error(f"Error deleting message {message_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete message"
        )
    
    end_time = time.time()
    log_performance_metrics("delete_message", start_time, end_time)
    
    logger.info(f"Message {message_id} deleted successfully by user {current_user.id}")
    
    # Track message deletion
    track_event(
        user_id=str(current_user.id),
        event="message_deleted_server",
        properties={
            "message_id": str(message_id),
            "recipient_id": str(message.recipient_id),
        }
    )
    
    return {"message": "Message deleted successfully"}
