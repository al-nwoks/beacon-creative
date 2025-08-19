from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.database import Base

class ProjectFile(Base):
    __tablename__ = "project_files"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    uploader_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    file_size = Column(Integer, nullable=True)
    file_type = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    project = relationship("Project", backref="files")
    uploader = relationship("User", backref="uploaded_files")
    
    def __repr__(self):
        return f"<ProjectFile {self.filename}>"
