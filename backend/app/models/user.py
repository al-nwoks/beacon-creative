from sqlalchemy import Column, String, Boolean, Float, DateTime, func, Enum, ARRAY, Integer
from sqlalchemy.orm import relationship
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
    portfolio_images = Column(ARRAY(String), nullable=True)  # Array of image URLs
    hourly_rate = Column(Float, nullable=True)
    availability = Column(String, nullable=True)
    
    # Profile stats
    projects_count = Column(Integer, default=0)
    followers_count = Column(Integer, default=0)
    reviews_count = Column(Integer, default=0)
    rating = Column(Float, default=0.0)

    # Creative-specific classification (e.g., Photographer, Model, DJ, Screenwriter)
    creative_type = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationship to notification settings
    notification_settings = relationship("NotificationSetting", uselist=False, back_populates="user", lazy="select")
    
    @property
    def notification_settings_safe(self):
        """Safe accessor for notification settings that ensures proper loading"""
        try:
            settings = self.notification_settings
            # Handle case where it might be an empty array
            if settings == []:
                return None
            return settings
        except:
            return None
    
    # Helper method to get notification settings
    def get_notification_settings(self, db):
        """Get notification settings for this user, creating defaults if none exist"""
        from app.models.notification_setting import NotificationSetting
        
        # Handle case where notification_settings might be an empty array
        if self.notification_settings == [] or self.notification_settings is None:
            notification_setting = db.query(NotificationSetting).filter(
                NotificationSetting.user_id == self.id
            ).first()
            
            if not notification_setting:
                # Create default settings
                notification_setting = NotificationSetting(user_id=self.id)
                db.add(notification_setting)
                db.commit()
                db.refresh(notification_setting)
            
            # Update the relationship
            self.notification_settings = notification_setting
        
        return self.notification_settings
    
    def __repr__(self):
        return f"<User {self.email}>"
