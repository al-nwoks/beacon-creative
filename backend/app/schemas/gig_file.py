from typing import Optional
from datetime import datetime
from pydantic import BaseModel, UUID4

from app.schemas.user import User
from app.schemas.gig import Gig

# Shared properties
class GigFileBase(BaseModel):
    filename: str
    file_url: str
    file_size: Optional[int] = None
    file_type: Optional[str] = None

# Properties to receive via API on creation
class GigFileCreate(GigFileBase):
    pass

# Properties to receive via API on update
class GigFileUpdate(BaseModel):
    filename: Optional[str] = None
    file_url: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None

# Properties shared by models stored in DB
class GigFileInDBBase(GigFileBase):
    id: UUID4
    gig_id: UUID4
    uploader_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Properties to return via API
class GigFile(GigFileInDBBase):
    pass

# Properties to return via API with uploader info
class GigFileWithUploader(GigFile):
    uploader: User

# Properties to return via API with gig info
class GigFileWithGig(GigFile):
    gig: Gig

# Properties to return via API with both uploader and gig info
class GigFileWithDetails(GigFile):
    uploader: User
    gig: Gig

# Properties stored in DB
class GigFileInDB(GigFileInDBBase):
    pass
