from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.database import Base

class NotificationSetting(Base):
    __tablename__ = "notification_settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Email notification preferences
    email_project_updates = Column(Boolean, default=True)
    email_messages = Column(Boolean, default=True)
    email_application_status = Column(Boolean, default=True)
    email_payment_updates = Column(Boolean, default=True)
    email_newsletter = Column(Boolean, default=True)
    
    # In-app notification preferences
    in_app_project_updates = Column(Boolean, default=True)
    in_app_messages = Column(Boolean, default=True)
    in_app_application_status = Column(Boolean, default=True)
    in_app_payment_updates = Column(Boolean, default=True)
    
    # Push notification preferences (for mobile apps)
    push_project_updates = Column(Boolean, default=True)
    push_messages = Column(Boolean, default=True)
    push_application_status = Column(Boolean, default=True)
    push_payment_updates = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="notification_settings", lazy="select")
    
    def __repr__(self):
        return f"<NotificationSetting {self.id} for user {self.user_id}>"