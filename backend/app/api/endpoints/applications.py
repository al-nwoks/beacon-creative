from typing import Any, List, Optional
import uuid
import logging

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

logger = logging.getLogger(__name__)

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
    logger.info(f"Fetching applications for creative user {current_user.id}")
    logger.debug(f"Filtering by status: {status}")
    
    # Base query
    query = db.query(Application).filter(Application.creative_id == current_user.id)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Application.status == status)
    
    applications = query.all()
    logger.info(f"Found {len(applications)} applications for user {current_user.id}")
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
    logger.info(f"Fetching applications for project {project_id} by client user {current_user.id}")
    
    # Check if project exists and belongs to the client
    project_id_uuid = uuid.UUID(project_id)
    project = db.query(Project).filter(
        Project.id == project_id_uuid,
        Project.client_id == current_user.id
    ).first()
    
    if not project:
        logger.warning(f"Project {project_id} not found or user {current_user.id} doesn't have permission")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or you don't have permission",
        )
    
    # Get all applications for the project
    applications = db.query(Application).filter(Application.project_id == project_id_uuid).all()
    logger.info(f"Found {len(applications)} applications for project {project_id}")
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
    logger.info(f"Fetching application {application_id} for user {current_user.id}")
    
    application_id_uuid = uuid.UUID(application_id)
    application = db.query(Application).filter(Application.id == application_id_uuid).first()
    if not application:
        logger.warning(f"Application {application_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # Check permissions (only the applicant or the project owner can view)
    project = db.query(Project).filter(Project.id == application.project_id).first()
    if application.creative_id != current_user.id and project.client_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to access application {application_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    logger.info(f"Application {application_id} retrieved successfully for user {current_user.id}")
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
    logger.info(f"Updating application {application_id} by user {current_user.id}")
    logger.debug(f"Update data: {application_in.dict(exclude_unset=True)}")
    
    application_id_uuid = uuid.UUID(application_id)
    application = db.query(Application).filter(Application.id == application_id_uuid).first()
    if not application:
        logger.warning(f"Application {application_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # Get the project
    project = db.query(Project).filter(Project.id == application.project_id).first()
    
    # Check permissions and what can be updated
    if current_user.role == "creative" and application.creative_id == current_user.id:
        logger.info(f"Creative user {current_user.id} updating application content")
        # Creative can update content but not status
        if application_in.status:
            logger.warning(f"Creative user {current_user.id} attempted to update application status")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Creative cannot update application status",
            )
        
        # Creative can only update pending applications
        if application.status != "pending":
            logger.warning(f"Creative user {current_user.id} attempted to update non-pending application {application_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update application that is not pending",
            )
        
        # Update content fields
        update_fields = []
        if application_in.cover_letter:
            application.cover_letter = application_in.cover_letter
            update_fields.append("cover_letter")
        if application_in.proposed_budget is not None:
            application.proposed_budget = application_in.proposed_budget
            update_fields.append("proposed_budget")
        if application_in.proposed_timeline_weeks is not None:
            application.proposed_timeline_weeks = application_in.proposed_timeline_weeks
            update_fields.append("proposed_timeline_weeks")
        
        logger.debug(f"Updated fields: {update_fields}")
    
    elif current_user.role == "client" and project.client_id == current_user.id:
        logger.info(f"Client user {current_user.id} updating application status")
        # Client can only update status
        if not application_in.status:
            logger.warning(f"Client user {current_user.id} attempted to update application without providing status")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status is required for client updates",
            )
        
        # Update status
        old_status = application.status
        application.status = application_in.status
        logger.info(f"Application {application_id} status changed from {old_status} to {application_in.status}")
        
        # If accepting application, update project
        if application_in.status == "accepted":
            logger.info(f"Application {application_id} accepted, updating project {project.id}")
            # Check if project is still active
            if project.status != "active":
                logger.warning(f"Cannot accept application for non-active project {project.id}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot accept application for a project that is not active",
                )
            
            # Update project status and hired creative
            project.status = "hired"
            project.hired_creative_id = application.creative_id
            db.add(project)
            logger.info(f"Project {project.id} status updated to hired with creative {application.creative_id}")
            
            # Reject all other applications
            other_applications = db.query(Application).filter(
                Application.project_id == application.project_id,
                Application.id != application_id_uuid,
                Application.status == "pending"
            ).all()
            
            rejected_count = 0
            for other_app in other_applications:
                other_app.status = "rejected"
                db.add(other_app)
                rejected_count += 1
            
            logger.info(f"Rejected {rejected_count} other applications for project {project.id}")
    
    else:
        logger.warning(f"User {current_user.id} attempted to update application {application_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    logger.info(f"Application {application_id} updated successfully")
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
    logger.info(f"Deleting application {application_id} by user {current_user.id}")
    
    application_id_uuid = uuid.UUID(application_id)
    application = db.query(Application).filter(Application.id == application_id_uuid).first()
    if not application:
        logger.warning(f"Application {application_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # Check if user is the owner of the application
    if application.creative_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to delete application {application_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if application can be deleted (only pending applications)
    if application.status != "pending":
        logger.warning(f"User {current_user.id} attempted to delete non-pending application {application_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete an application that has been accepted or rejected",
        )
    
    db.delete(application)
    db.commit()
    logger.info(f"Application {application_id} deleted successfully by user {current_user.id}")
    return {"message": "Application deleted successfully"}
