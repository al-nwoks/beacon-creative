from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from typing import Optional, List
import enum
import uuid

from app.db.database import Base

class UserRole(str, enum.Enum):
    creative = "creative"
    client = "client"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    
    # Profile information
    bio = Column(Text)
    location = Column(String)
    profile_image_url = Column(String)
    company_name = Column(String)  # For clients
    hourly_rate = Column(Integer)  # For creatives
    skills = Column(ARRAY(String))  # For creatives
    portfolio_links = Column(ARRAY(String))  # For creatives
    portfolio_images = Column(ARRAY(String))  # For creatives - base64 encoded images
    creative_type = Column(String)  # For creatives (Photographer, Designer, etc.)
    
    # Profile stats
    gigs_count = Column(Integer, default=0)
    followers_count = Column(Integer, default=0)
    reviews_count = Column(Integer, default=0)
    rating = Column(Integer, default=0)  # Out of 5
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    last_login = Column(DateTime)
    
    # Relationships
    # These are defined in the other models with foreign keys
    notification_settings = relationship("NotificationSetting", back_populates="user", uselist=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
