from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, validator

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_image_url: Optional[str] = None
    hourly_rate: Optional[int] = None
    skills: Optional[List[str]] = None
    portfolio_links: Optional[List[str]] = None
    portfolio_images: Optional[List[str]] = None
    creative_type: Optional[str] = None
    
    # Profile stats
    gigs_count: Optional[int] = 0
    followers_count: Optional[int] = 0
    reviews_count: Optional[int] = 0
    rating: Optional[float] = 0.0
    
    # Account status
    is_active: Optional[bool] = True
    is_verified: Optional[bool] = False

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str
    confirm_password: str
    
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

# Properties to receive via API on update
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    profile_image_url: Optional[str] = None
    hourly_rate: Optional[int] = None
    skills: Optional[List[str]] = None
    portfolio_links: Optional[List[str]] = None
    portfolio_images: Optional[List[str]] = None
    creative_type: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

# Properties to return via API
class User(UserInDBBase):
    pass

# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str

# Properties to return via API for authentication
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: int
    exp: int
