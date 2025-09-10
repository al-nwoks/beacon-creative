from typing import Optional
from pydantic import BaseModel

class NotificationSettingBase(BaseModel):
    email_gig_updates: Optional[bool] = True
    email_messages: Optional[bool] = True
    email_application_updates: Optional[bool] = True
    email_payment_updates: Optional[bool] = True
    email_newsletter: Optional[bool] = True
    in_app_gig_updates: Optional[bool] = True
    in_app_messages: Optional[bool] = True
    in_app_application_updates: Optional[bool] = True
    in_app_payment_updates: Optional[bool] = True
    push_gig_updates: Optional[bool] = True
    push_messages: Optional[bool] = True
    push_application_updates: Optional[bool] = True
    push_payment_updates: Optional[bool] = True

class NotificationSettingCreate(NotificationSettingBase):
    pass

class NotificationSettingUpdate(NotificationSettingBase):
    pass

class NotificationSettingInDBBase(NotificationSettingBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class NotificationSetting(NotificationSettingInDBBase):
    pass

# Properties stored in DB
class NotificationSettingInDB(NotificationSettingInDBBase):
    pass