from typing import Any, List, Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.application import Application
from app.schemas.application import (
    Application as ApplicationSchema,
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationWithCreative,
    ApplicationWithProject,
    ApplicationWithDetails
)
from app.auth.dependencies import (
    get_current_active_user,
    get_current_client_user,
    get_current_creative_user
)

router = APIRouter()

@router.post("/", response_model=ApplicationSchema)
def create_application(
    *,
    db: Session = Depends(get_db),
    application_in: ApplicationCreate,
    current_user: User = Depends(get_current_creative_user),
) -> Any:
    """
    Create a new application for a project (creative only).
    """
    logger.info(f"Creating application for project ID: {application_in.project_id} by user ID: {current_user.id}")
    logger.debug(f"Application data: cover_letter_length={len(application_in.cover_letter)}, proposed_budget={application_in.proposed_budget}")
    
    # Check if project exists
    project = db.query(Project).filter(Project.id == application_in.project_id).first()
    if not project:
        logger.warning(f"Application failed: Project {application_in.project_id} not found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    # Check if project is open for applications
    if project.status != "active":
        logger.warning(f"Application failed: Project {application_in.project_id} is not accepting applications (status: {project.status})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project is not accepting applications",
        )
    
    # Check if user has already applied
    existing_application = db.query(Application).filter(
        Application.project_id == application_in.project_id,
        Application.creative_id == current_user.id
    ).first()
    
    if existing_application:
        logger.warning(f"Application failed: User {current_user.id} has already applied to project {application_in.project_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this project",
        )
    
    # Create new application
    # Convert project_id string to UUID
    application_data = application_in.dict()
    application_data["project_id"] = uuid.UUID(application_data["project_id"])
    
    db_application = Application(
        **application_data,
        creative_id=current_user.id,
        status="pending"
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    logger.info(f"Application created successfully with ID: {db_application.id} for project ID: {application_in.project_id}")
    return db_application

@router.get("/me", response_model=List[ApplicationWithProject])
def get_my_applications(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_creative_user),
    status: Optional[str] = None,
) -> Any:
    """
    Get all applications created by the current user (creative only).
    """
    # Base query
    query = db.query(Application).filter(Application.creative_id == current_user.id)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Application.status == status)
    
    applications = query.all()
    return applications

@router.get("/project/{project_id}", response_model=List[ApplicationWithCreative])
def get_project_applications(
    *,
    db: Session = Depends(get_db),
    project_id: str,
    current_user: User = Depends(get_current_client_user),
) -> Any:
    """
    Get all applications for a specific project (client only).
    """
    # Check if project exists and belongs to the client
    project_id_uuid = uuid.UUID(project_id)
    project = db.query(Project).filter(
        Project.id == project_id_uuid,
        Project.client_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or you don't have permission",
        )
    
    # Get all applications for the project
    applications = db.query(Application).filter(Application.project_id == project_id_uuid).all()
    return applications

@router.get("/{application_id}", response_model=ApplicationWithDetails)
def get_application(
    *,
    db: Session = Depends(get_db),
    application_id: str,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific application by id.
    """
    application_id_uuid = uuid.UUID(application_id)
    application = db.query(Application).filter(Application.id == application_id_uuid).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # Check permissions (only the applicant or the project owner can view)
    project = db.query(Project).filter(Project.id == application.project_id).first()
    if application.creative_id != current_user.id and project.client_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return application

@router.put("/{application_id}", response_model=ApplicationSchema)
def update_application(
    *,
    db: Session = Depends(get_db),
    application_id: str,
    application_in: ApplicationUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update an application (creative can update content, client can update status).
    """
    application_id_uuid = uuid.UUID(application_id)
    application = db.query(Application).filter(Application.id == application_id_uuid).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # Get the project
    project = db.query(Project).filter(Project.id == application.project_id).first()
    
    # Check permissions and what can be updated
    if current_user.role == "creative" and application.creative_id == current_user.id:
        # Creative can update content but not status
        if application_in.status:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Creative cannot update application status",
            )
        
        # Creative can only update pending applications
        if application.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update application that is not pending",
            )
        
        # Update content fields
        if application_in.cover_letter:
            application.cover_letter = application_in.cover_letter
        if application_in.proposed_budget is not None:
            application.proposed_budget = application_in.proposed_budget
        if application_in.proposed_timeline_weeks is not None:
            application.proposed_timeline_weeks = application_in.proposed_timeline_weeks
    
    elif current_user.role == "client" and project.client_id == current_user.id:
        # Client can only update status
        if not application_in.status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status is required for client updates",
            )
        
        # Update status
        application.status = application_in.status
        
        # If accepting application, update project
        if application_in.status == "accepted":
            # Check if project is still active
            if project.status != "active":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot accept application for a project that is not active",
                )
            
            # Update project status and hired creative
            project.status = "hired"
            project.hired_creative_id = application.creative_id
            db.add(project)
            
            # Reject all other applications
            other_applications = db.query(Application).filter(
                Application.project_id == application.project_id,
                Application.id != application_id_uuid,
                Application.status == "pending"
            ).all()
            
            for other_app in other_applications:
                other_app.status = "rejected"
                db.add(other_app)
    
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.delete("/{application_id}", status_code=status.HTTP_200_OK)
def delete_application(
    *,
    db: Session = Depends(get_db),
    application_id: str,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete an application (creative only).
    """
    application_id_uuid = uuid.UUID(application_id)
    application = db.query(Application).filter(Application.id == application_id_uuid).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # Check if user is the owner of the application
    if application.creative_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if application can be deleted (only pending applications)
    if application.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete an application that has been accepted or rejected",
        )
    
    db.delete(application)
    db.commit()
    return {"message": "Application deleted successfully"}
