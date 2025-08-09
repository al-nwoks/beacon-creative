from sqlalchemy import Column, String, Boolean, Float, DateTime, func, Enum, ARRAY, Integer
import uuid

from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(Enum("creative", "client", "admin", name="userrole"), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    profile_image_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    location = Column(String, nullable=True)
    website = Column(String, nullable=True)
    skills = Column(ARRAY(String), nullable=True)
    portfolio_links = Column(ARRAY(String), nullable=True)
    hourly_rate = Column(Float, nullable=True)
    availability = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<User {self.email}>"
