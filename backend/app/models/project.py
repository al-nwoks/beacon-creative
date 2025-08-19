from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, func, Enum, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.database import Base

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    client_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    timeline_weeks = Column(Integer, nullable=True)
    required_skills = Column(ARRAY(String), nullable=True)
    status = Column(
        Enum("draft", "active", "hired", "completed", "cancelled", name="project_status"),
        default="active",
        nullable=False
    )
    hired_creative_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    client = relationship("User", foreign_keys=[client_id], backref="created_projects")
    hired_creative = relationship("User", foreign_keys=[hired_creative_id], backref="hired_projects")
    
    def __repr__(self):
        return f"<Project {self.title}>"
