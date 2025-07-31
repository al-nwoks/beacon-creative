from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, func, Enum, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.database import Base

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    creative_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    cover_letter = Column(String, nullable=False)
    proposed_budget = Column(Float, nullable=True)
    proposed_timeline_weeks = Column(Integer, nullable=True)
    status = Column(
        Enum("pending", "accepted", "rejected", name="application_status"),
        default="pending",
        nullable=False
    )
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    project = relationship("Project", backref="applications")
    creative = relationship("User", backref="applications")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('project_id', 'creative_id', name='unique_project_creative'),
    )
    
    def __repr__(self):
        return f"<Application {self.id}>"
