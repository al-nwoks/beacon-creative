from typing import Optional
from datetime import datetime
from pydantic import BaseModel, UUID4

from app.schemas.user import User
from app.schemas.project import Project

# Shared properties
class ProjectFileBase(BaseModel):
    filename: str
    file_url: str
    file_size: Optional[int] = None
    file_type: Optional[str] = None

# Properties to receive via API on creation
class ProjectFileCreate(ProjectFileBase):
    project_id: UUID4

# Properties to receive via API on update
class ProjectFileUpdate(BaseModel):
    filename: Optional[str] = None

# Properties shared by models stored in DB
class ProjectFileInDBBase(ProjectFileBase):
    id: UUID4
    project_id: UUID4
    uploader_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Properties to return via API
class ProjectFile(ProjectFileInDBBase):
    pass

# Properties to return via API with uploader info
class ProjectFileWithUploader(ProjectFile):
    uploader: User

# Properties to return via API with project info
class ProjectFileWithProject(ProjectFile):
    project: Project

# Properties to return via API with both uploader and project info
class ProjectFileWithDetails(ProjectFile):
    uploader: User
    project: Project

# Properties stored in DB
class ProjectFileInDB(ProjectFileInDBBase):
    pass
