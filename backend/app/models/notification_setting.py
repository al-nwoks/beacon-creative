from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.database import Base

class NotificationSetting(Base):
    __tablename__ = "notification_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Email notification preferences
    email_gig_updates = Column(Boolean, default=True)
    email_messages = Column(Boolean, default=True)
    email_application_updates = Column(Boolean, default=True)
    email_payment_updates = Column(Boolean, default=True)
    email_newsletter = Column(Boolean, default=True)
    
    # In-app notification preferences
    in_app_gig_updates = Column(Boolean, default=True)
    in_app_messages = Column(Boolean, default=True)
    in_app_application_updates = Column(Boolean, default=True)
    in_app_payment_updates = Column(Boolean, default=True)
    
    # Push notification preferences (for mobile apps)
    push_gig_updates = Column(Boolean, default=True)
    push_messages = Column(Boolean, default=True)
    push_application_updates = Column(Boolean, default=True)
    push_payment_updates = Column(Boolean, default=True)
    
    # Relationship
    user = relationship("User", back_populates="notification_settings")