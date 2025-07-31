from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.database import get_db
from app.models.user import User
from app.models.project import Project
from app.schemas.project import (
    Project as ProjectSchema,
    ProjectCreate,
    ProjectUpdate,
    ProjectWithClient,
    ProjectWithUsers
)
from app.auth.dependencies import (
    get_current_active_user,
    get_current_client_user,
    get_current_creative_user
)

router = APIRouter()

@router.post("/", response_model=ProjectSchema)
def create_project(
    *,
    db: Session = Depends(get_db),
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_client_user),
) -> Any:
    """
    Create a new project (client only).
    """
    # Create new project
    db_project = Project(
        **project_in.dict(),
        client_id=current_user.id,
        status="active"
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/", response_model=List[ProjectWithClient])
def get_projects(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
) -> Any:
    """
    Get all projects with filters.
    """
    # Base query
    query = db.query(Project)
    
    # Apply filters
    if status:
        query = query.filter(Project.status == status)
    else:
        # By default, only show active projects
        query = query.filter(Project.status == "active")
    
    if category:
        query = query.filter(Project.category == category)
    
    if search:
        query = query.filter(
            or_(
                Project.title.ilike(f"%{search}%"),
                Project.description.ilike(f"%{search}%")
            )
        )
    
    # Get projects with pagination
    projects = query.offset(skip).limit(limit).all()
    return projects

@router.get("/my-projects", response_model=List[ProjectSchema])
def get_my_projects(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    status: Optional[str] = None,
) -> Any:
    """
    Get all projects created by the current user (client) or hired for (creative).
    """
    if current_user.role == "client":
        # Get projects created by the client
        query = db.query(Project).filter(Project.client_id == current_user.id)
    else:
        # Get projects the creative is hired for
        query = db.query(Project).filter(Project.hired_creative_id == current_user.id)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Project.status == status)
    
    projects = query.all()
    return projects

@router.get("/{project_id}", response_model=ProjectWithUsers)
def get_project(
    *,
    db: Session = Depends(get_db),
    project_id: str,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific project by id.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    return project

@router.put("/{project_id}", response_model=ProjectSchema)
def update_project(
    *,
    db: Session = Depends(get_db),
    project_id: str,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a project (client only, unless updating status).
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    # Check permissions
    if project.client_id != current_user.id and current_user.role != "creative":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # If user is creative, they can only update status
    if current_user.role == "creative" and project.hired_creative_id == current_user.id:
        if project_in.status:
            project.status = project_in.status
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Creative can only update project status",
            )
    else:
        # Update project attributes
        for field, value in project_in.dict(exclude_unset=True).items():
            setattr(project, field, value)
    
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_200_OK)
def delete_project(
    *,
    db: Session = Depends(get_db),
    project_id: str,
    current_user: User = Depends(get_current_client_user),
) -> Any:
    """
    Delete a project (client only).
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    # Check if user is the project owner
    if project.client_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if project can be deleted (only draft or active projects)
    if project.status not in ["draft", "active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a project that is already hired, completed, or cancelled",
        )
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}
