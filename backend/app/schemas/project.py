from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, UUID4, Field, validator

from app.schemas.user import User

# Shared properties
class ProjectBase(BaseModel):
    title: str
    description: str
    category: str
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    timeline_weeks: Optional[int] = None
    required_skills: Optional[List[str]] = None

# Properties to receive via API on creation
class ProjectCreate(ProjectBase):
    pass

# Properties to receive via API on update
class ProjectUpdate(BaseModel):
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
class ProjectInDBBase(ProjectBase):
    id: UUID4
    client_id: int
    status: str
    hired_creative_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Properties to return via API
class Project(ProjectInDBBase):
    pass

# Properties to return via API with client info
class ProjectWithClient(Project):
    client: User

# Properties to return via API with hired creative info
class ProjectWithCreative(Project):
    hired_creative: Optional[User] = None

# Properties to return via API with both client and creative info
class ProjectWithUsers(Project):
    client: User
    hired_creative: Optional[User] = None

# Properties stored in DB
class ProjectInDB(ProjectInDBBase):
    pass
