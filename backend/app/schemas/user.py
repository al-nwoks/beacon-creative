from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Union

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_image_url: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str
    confirm_password: str

# Properties to receive via API on update
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_image_url: Optional[str] = None
    hourly_rate: Optional[float] = None
    skills: Optional[List[str]] = None
    portfolio_links: Optional[List[str]] = None

# Properties shared by models stored in DB
class UserInDBBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_image_url: Optional[str] = None
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    hourly_rate: Optional[float] = None
    skills: Optional[List[str]] = None
    portfolio_links: Optional[List[str]] = None

    class Config:
        from_attributes = True

# Properties to return via API
class User(UserInDBBase):
    pass

# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str

# Token schema
class Token(BaseModel):
    access_token: str
    token_type: str

# Token payload
class TokenPayload(BaseModel):
    sub: Optional[str] = None
