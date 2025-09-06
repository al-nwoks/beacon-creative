from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

# Shared properties
class NotificationSettingBase(BaseModel):
    email_project_updates: Optional[bool] = True
    email_messages: Optional[bool] = True
    email_application_status: Optional[bool] = True
    email_payment_updates: Optional[bool] = True
    email_newsletter: Optional[bool] = True
    in_app_project_updates: Optional[bool] = True
    in_app_messages: Optional[bool] = True
    in_app_application_status: Optional[bool] = True
    in_app_payment_updates: Optional[bool] = True
    push_project_updates: Optional[bool] = True
    push_messages: Optional[bool] = True
    push_application_status: Optional[bool] = True
    push_payment_updates: Optional[bool] = True

# Properties to receive via API on creation
class NotificationSettingCreate(NotificationSettingBase):
    user_id: int

# Properties to receive via API on update
class NotificationSettingUpdate(NotificationSettingBase):
    pass

# Properties to return via API
class NotificationSetting(NotificationSettingBase):
    id: UUID
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True