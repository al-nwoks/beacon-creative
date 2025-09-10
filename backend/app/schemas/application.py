from typing import Optional
from datetime import datetime
from pydantic import BaseModel, UUID4, validator

from app.schemas.user import User
from app.schemas.gig import Gig

# Shared properties
class ApplicationBase(BaseModel):
    cover_letter: str
    proposed_budget: Optional[float] = None
    proposed_timeline_weeks: Optional[int] = None

# Properties to receive via API on creation
class ApplicationCreate(ApplicationBase):
    gig_id: str

# Properties to receive via API on update
class ApplicationUpdate(BaseModel):
    cover_letter: Optional[str] = None
    proposed_budget: Optional[float] = None
    proposed_timeline_weeks: Optional[int] = None
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v not in ["pending", "accepted", "rejected"]:
            raise ValueError('Invalid status value')
        return v

# Properties shared by models stored in DB
class ApplicationInDBBase(ApplicationBase):
    id: UUID4
    gig_id: UUID4
    creative_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Properties to return via API
class Application(ApplicationInDBBase):
    pass

# Properties to return via API with creative info
class ApplicationWithCreative(Application):
    creative: User

# Properties to return via API with gig info
class ApplicationWithGig(Application):
    gig: Gig

# Properties to return via API with both creative and gig info
class ApplicationWithDetails(Application):
    creative: User
    gig: Gig

# Properties stored in DB
class ApplicationInDB(ApplicationInDBBase):
    pass
