from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.database import Base

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    gig_id = Column(UUID(as_uuid=True), ForeignKey("gigs.id", ondelete="CASCADE"), nullable=True)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=True)
    content = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    is_pinned = Column(Boolean, default=False)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    reactions = Column(JSON, default=dict)  # Stores reactions as {"emoji": [user_ids]}
    forwarded_from_id = Column(UUID(as_uuid=True), ForeignKey("messages.id", ondelete="SET NULL"), nullable=True)
    
    # Relationship to original message if forwarded
    forwarded_from = relationship("Message", remote_side=[id])
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_messages")
    recipient = relationship("User", foreign_keys=[recipient_id], backref="received_messages")
    gig = relationship("Gig", backref="messages")
    application = relationship("Application", backref="messages")
    
    def __repr__(self):
        return f"<Message {self.id}>"
