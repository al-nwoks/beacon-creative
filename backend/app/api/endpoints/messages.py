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


@router.put("/{message_id}/read", response_model=MessageWithUsers)
def mark_message_as_read(
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
    query: str = Query(..., min_length=1),
    skip: int = 0,
    limit: int = 50,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Search messages for the current user.
    """
    logger.info(f"Searching messages for user {current_user.id} with query: {query}")
    
    # Validate query parameter
    if not query or len(query.strip()) == 0:
        logger.warning(f"Empty search query provided by user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty",
        )
    
    # Build the query for messages that contain the search term
    search_query = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.recipient_id == current_user.id
        )
    ).filter(
        Message.content.ilike(f"%{query.strip()}%")
    )
    
    # Order by created_at descending and apply pagination
    search_query = search_query.order_by(Message.created_at.desc()).offset(skip).limit(limit)
    
    messages = search_query.all()
    
    logger.info(f"Found {len(messages)} messages matching query: {query}")
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
    
    # Read file content
    try:
        file_content = await file.read()
        
        # For now, we'll store files as base64 in the message content
        # In production, you'd upload to S3 or similar storage
        import base64
        file_base64 = base64.b64encode(file_content).decode('utf-8')
        
        # Create message content with file info
        message_content = f"📎 {file.filename}"
        file_data = {
            "type": "file",
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(file_content),
            "data": file_base64
        }
        
        # Store file data in a separate field (you'd need to add this to the Message model)
        # For now, we'll include it in the content as JSON
        import json
        message_content = json.dumps({
            "text": f"📎 {file.filename}",
            "file": file_data
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


@router.delete("/{message_id}")
def delete_message(
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
    
    # Delete the message
    db.delete(message)
    db.commit()
    
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
