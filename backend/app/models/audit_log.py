from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
import uuid

from app.db.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    admin_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String, nullable=False)  # CREATE, UPDATE, DELETE, SUSPEND, ACTIVATE
    resource_type = Column(String, nullable=False)  # user, gig, payment, etc.
    resource_id = Column(String, nullable=False)  # ID of the affected resource
    old_values = Column(JSON, nullable=True)  # Previous values (for updates)
    new_values = Column(JSON, nullable=True)  # New values (for creates/updates)
    description = Column(Text, nullable=True)  # Human-readable description
    ip_address = Column(String, nullable=True)  # Admin's IP address
    user_agent = Column(String, nullable=True)  # Admin's user agent
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    admin_user = relationship("User", backref="audit_logs")
    
    def __repr__(self):
        return f"<AuditLog {self.id}: {self.action} {self.resource_type} {self.resource_id}>"