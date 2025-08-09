from typing import Any, List
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, Project as ProjectSchema
from app.auth.dependencies import get_current_active_user_dependency, get_current_client_user_dependency
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[ProjectSchema])
def get_projects(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Retrieve projects.
    """
    logger.info(f"Fetching projects for user {current_user.id}")
    projects = db.query(Project).offset(skip).limit(limit).all()
    logger.debug(f"Found {len(projects)} projects")
    return projects


@router.post("/", response_model=ProjectSchema)
def create_project(
    *,
    db: Session = Depends(get_db),
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_client_user_dependency)
) -> Any:
    """
    Create new project.
    Only clients can create projects.
    """
    logger.info(f"Creating project for client user {current_user.id}")
    logger.debug(f"Project data: {project_in.dict()}")
    
    db_project = Project(
        title=project_in.title,
        description=project_in.description,
        category=project_in.category,
        budget_min=project_in.budget_min,
        budget_max=project_in.budget_max,
        timeline_weeks=project_in.timeline_weeks,
        client_id=current_user.id,
        required_skills=project_in.required_skills or []
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    logger.info(f"Project created successfully with ID: {db_project.id}")
    return db_project


@router.get("/{project_id}", response_model=ProjectSchema)
def get_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Get project by ID.
    """
    logger.info(f"Fetching project {project_id} for user {current_user.id}")
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        logger.warning(f"Project {project_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user has permission to view this project
    if current_user.role == "client" and project.client_id != current_user.id:
        logger.warning(f"Client user {current_user.id} attempted to access project {project_id} belonging to another client")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this project"
        )
    
    logger.debug(f"Project {project_id} found")
    return project


@router.put("/{project_id}", response_model=ProjectSchema)
def update_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_client_user_dependency)
) -> Any:
    """
    Update a project.
    Only the client who created the project can update it.
    """
    logger.info(f"Updating project {project_id} for client user {current_user.id}")
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        logger.warning(f"Project {project_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is the owner of the project
    if project.client_id != current_user.id:
        logger.warning(f"Client user {current_user.id} attempted to update project {project_id} belonging to another client")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this project"
        )
    
    # Update project attributes
    for field, value in project_in.dict(exclude_unset=True).items():
        setattr(project, field, value)
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    logger.info(f"Project {project_id} updated successfully")
    return project


@router.delete("/{project_id}", response_model=ProjectSchema)
def delete_project(
    *,
    db: Session = Depends(get_db),
    project_id: int,
    current_user: User = Depends(get_current_client_user_dependency)
) -> Any:
    """
    Delete a project.
    Only the client who created the project can delete it.
    """
    logger.info(f"Deleting project {project_id} for client user {current_user.id}")
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        logger.warning(f"Project {project_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is the owner of the project
    if project.client_id != current_user.id:
        logger.warning(f"Client user {current_user.id} attempted to delete project {project_id} belonging to another client")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this project"
        )
    
    db.delete(project)
    db.commit()
    
    logger.info(f"Project {project_id} deleted successfully")
    return project


@router.get("/my-projects", response_model=List[ProjectSchema])
def get_my_projects(
    *,
    db: Session = Depends(get_db),
    status: str = None,
    current_user: User = Depends(get_current_client_user_dependency)
) -> Any:
    """
    Get current user's projects.
    Only clients can view their own projects.
    """
    logger.info(f"Fetching projects for client user {current_user.id}")
    
    query = db.query(Project).filter(Project.client_id == current_user.id)
    if status:
        query = query.filter(Project.status == status)
    
    projects = query.all()
    logger.debug(f"Found {len(projects)} projects for client user {current_user.id}")
    return projects
