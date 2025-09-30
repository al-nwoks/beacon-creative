from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, UUID4, Field, validator

from app.schemas.user import User

# Shared properties
class GigBase(BaseModel):
    title: str
    description: str
    category: str
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    timeline_weeks: Optional[int] = None
    required_skills: Optional[List[str]] = None

# Properties to receive via API on creation
class GigCreate(GigBase):
    pass

# Properties to receive via API on update
class GigUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    timeline_weeks: Optional[int] = None
    required_skills: Optional[List[str]] = None
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v not in ["draft", "active", "hired", "completed", "cancelled"]:
            raise ValueError('Invalid status value')
        return v

# Properties shared by models stored in DB
class GigInDBBase(GigBase):
    id: UUID4
    client_id: int
    status: str
    hired_creative_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Properties to return via API
class Gig(GigInDBBase):
    pass

# Properties to return via API with client info
class GigWithClient(Gig):
    client: User

# Properties to return via API with hired creative info
class GigWithCreative(Gig):
    hired_creative: Optional[User] = None

# Properties to return via API with both client and creative info
class GigWithUsers(Gig):
    client: User
    hired_creative: Optional[User] = None

# Properties stored in DB
class GigInDB(GigInDBBase):
    pass
