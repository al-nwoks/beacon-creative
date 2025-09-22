from typing import Optional, Dict, List
from datetime import datetime
from pydantic import BaseModel, UUID4

from app.schemas.user import User

# Shared properties
class MessageBase(BaseModel):
    content: str
    gig_id: Optional[UUID4] = None
    application_id: Optional[UUID4] = None

# Properties to receive via API on creation
class MessageCreate(MessageBase):
    recipient_id: str

# Properties to receive via API on update
class MessageUpdate(BaseModel):
    is_read: Optional[bool] = None

# Properties shared by models stored in DB
class MessageInDBBase(MessageBase):
    id: UUID4
    sender_id: int
    recipient_id: int
    is_read: bool
    is_pinned: bool = False
    is_favorite: bool = False
    created_at: datetime
    forwarded_from_id: Optional[UUID4] = None
    forwarded_from: Optional["Message"] = None
    reactions: Dict[str, List[int]] = {}  # {"emoji": [user_ids]}

    class Config:
        from_attributes = True

# Properties to return via API
class Message(MessageInDBBase):
    pass

# Properties to return via API with sender info
class MessageWithSender(Message):
    sender: User

# Properties to return via API with recipient info
class MessageWithRecipient(Message):
    recipient: User

# Properties to return via API with both sender and recipient info
class MessageWithUsers(Message):
    sender: User
    recipient: User

# Properties stored in DB
class MessageInDB(MessageInDBBase):
    pass

# Conversation summary
class Conversation(BaseModel):
    user: User
    last_message: Message
    unread_count: int
    updated_at: datetime
