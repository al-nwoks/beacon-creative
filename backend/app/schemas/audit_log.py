from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, UUID4

# Shared properties
class AuditLogBase(BaseModel):
    action: str
    resource_type: str
    resource_id: str
    old_values: Optional[Dict[str, Any]] = None
    new_values: Optional[Dict[str, Any]] = None
    description: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

# Properties to receive via API on creation
class AuditLogCreate(AuditLogBase):
    admin_user_id: int

# Properties shared by models stored in DB
class AuditLogInDBBase(AuditLogBase):
    id: UUID4
    admin_user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Properties to return via API
class AuditLog(AuditLogInDBBase):
    pass

# Properties stored in DB
class AuditLogInDB(AuditLogInDBBase):
    pass