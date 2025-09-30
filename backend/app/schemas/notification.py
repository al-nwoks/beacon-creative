from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class NotificationBase(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    read: Optional[bool] = False

# Properties to receive via API on creation
class NotificationCreate(NotificationBase):
    user_id: int
    title: str
    body: str

# Properties to receive via API on update
class NotificationUpdate(NotificationBase):
    pass

# Properties to return via API
class Notification(NotificationBase):
    id: UUID
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Properties stored in DB
class NotificationInDB(Notification):
    pass

# Properties for list responses
class NotificationList(BaseModel):
    items: List[Notification]
    total: int
    page: int
    pageSize: int