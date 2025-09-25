import logging
import uuid
from typing import Any, List
import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.gig import Gig
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationWithCreative, ApplicationWithGig, ApplicationWithDetails
from app.auth.dependencies import get_current_active_user_dependency, get_current_creative_user, get_current_client_user
from app.utils.performance import log_performance_metrics, log_query_performance

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=ApplicationWithCreative)
def create_application(
    *,
    db: Session = Depends(get_db),
    application_in: ApplicationCreate,
    current_user: User = Depends(get_current_creative_user)
) -> Any:
    """
    Create a new application for a gig (creative only).
    """
    start_time = time.time()
    logger.info(f"Creating application for gig ID: {application_in.gig_id} by user ID: {current_user.id}")
    logger.debug(f"Application data: cover_letter_length={len(application_in.cover_letter)}, proposed_budget={application_in.proposed_budget}")
    
    # Check if gig exists
    gig = db.query(Gig).filter(Gig.id == application_in.gig_id).first()
    if not gig:
        logger.warning(f"Application failed: Gig {application_in.gig_id} not found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found",
        )
    
    # Check if gig is open for applications
    if gig.status != "active":
        logger.warning(f"Application failed: Gig {application_in.gig_id} is not accepting applications (status: {gig.status})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This gig is not accepting applications",
        )
    
    # Check if user has already applied to this gig
    existing_application = db.query(Application).filter(
        Application.gig_id == application_in.gig_id,
        Application.creative_id == current_user.id
    ).first()
    
    if existing_application:
        logger.warning(f"Application failed: User {current_user.id} has already applied to gig {application_in.gig_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this gig",
        )
    
    # Create new application
    # Convert gig_id string to UUID
    application_data = application_in.dict()
    application_data["gig_id"] = uuid.UUID(application_data["gig_id"])
    
    db_application = Application(**application_data, creative_id=current_user.id)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    end_time = time.time()
    log_performance_metrics("create_application", start_time, end_time)
    
    logger.info(f"Application created successfully with ID: {db_application.id} for gig ID: {application_in.gig_id}")
    return db_application


@router.get("/gig/{gig_id}", response_model=List[ApplicationWithCreative])
def get_gig_applications(
    *,
    db: Session = Depends(get_db),
    gig_id: str,
    current_user: User = Depends(get_current_client_user)
) -> Any:
    """
    Get all applications for a specific gig (client only).
    """
    logger.info(f"Fetching applications for gig {gig_id} by client user {current_user.id}")
    
    # Check if gig exists and belongs to the client
    gig_id_uuid = uuid.UUID(gig_id)
    gig = db.query(Gig).filter(
        Gig.id == gig_id_uuid,
        Gig.client_id == current_user.id
    ).first()
    
    if not gig:
        logger.warning(f"Gig {gig_id} not found or user {current_user.id} doesn't have permission")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found or you don't have permission to view its applications",
        )
    
    # Get all applications for the gig
    applications = db.query(Application).filter(Application.gig_id == gig_id_uuid).all()
    logger.info(f"Found {len(applications)} applications for gig {gig_id}")
    return applications


@router.get("/me", response_model=List[ApplicationWithCreative])
def get_my_applications(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_creative_user)
) -> Any:
    """
    Get current user's applications with pagination.
    Only creatives can view their own applications.
    """
    logger.info(f"Fetching applications for creative user {current_user.id}")
    logger.debug(f"Pagination parameters: skip={skip}, limit={limit}")
    
    query = db.query(Application).filter(Application.creative_id == current_user.id)
    
    # Apply pagination
    applications = query.offset(skip).limit(limit).all()
    logger.debug(f"Found {len(applications)} applications for creative user {current_user.id}")
    return applications


@router.get("/client/me", response_model=List[ApplicationWithCreative])
def get_client_applications(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_client_user)
) -> Any:
    """
    Get applications to current client's gigs with pagination.
    Only clients can view applications to their gigs.
    """
    logger.info(f"Fetching applications for client user {current_user.id}")
    logger.debug(f"Pagination parameters: skip={skip}, limit={limit}")
    
    # Get applications for gigs owned by this client
    query = db.query(Application).join(Gig).filter(Gig.client_id == current_user.id)
    
    # Apply pagination
    applications = query.offset(skip).limit(limit).all()
    logger.debug(f"Found {len(applications)} applications for client user {current_user.id}")
    return applications


@router.get("/{application_id}", response_model=ApplicationWithCreative)
def get_application(
    *,
    db: Session = Depends(get_db),
    application_id: str,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get a specific application by ID.
    """
    logger.info(f"Fetching application {application_id} for user {current_user.id}")
    
    # Convert string ID to UUID
    try:
        application_id_uuid = uuid.UUID(application_id)
    except ValueError:
        logger.warning(f"Invalid application ID format: {application_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID format",
        )
    
    # Get the application
    application = db.query(Application).filter(Application.id == application_id_uuid).first()
    if not application:
        logger.warning(f"Application {application_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # Check permissions (only the applicant or the gig owner can view)
    gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
    if application.creative_id != current_user.id and gig.client_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to access application {application_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this application",
        )
    
    logger.info(f"Application {application_id} found for user {current_user.id}")
    return application


@router.put("/{application_id}", response_model=ApplicationWithCreative)
def update_application(
    *,
    db: Session = Depends(get_db),
    application_id: str,
    application_in: ApplicationUpdate,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Update an application.
    Creatives can update their application details.
    Clients can update the application status (accept/reject).
    """
    logger.info(f"Updating application {application_id} by user {current_user.id}")
    logger.debug(f"Update data: {application_in.dict(exclude_unset=True)}")
    
    # Convert string ID to UUID
    try:
        application_id_uuid = uuid.UUID(application_id)
    except ValueError:
        logger.warning(f"Invalid application ID format: {application_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID format",
        )
    
    # Get the application
    application = db.query(Application).filter(Application.id == application_id_uuid).first()
    if not application:
        logger.warning(f"Application {application_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # Get the gig
    gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
    
    # Check permissions
    if current_user.role == "creative" and application.creative_id == current_user.id:
        logger.info(f"Creative user {current_user.id} updating application details")
        # Creatives can only update cover letter, budget, and timeline
        updatable_fields = ["cover_letter", "proposed_budget", "proposed_timeline_weeks"]
        for field in updatable_fields:
            if hasattr(application_in, field) and getattr(application_in, field) is not None:
                setattr(application, field, getattr(application_in, field))
    
    elif current_user.role == "client" and gig.client_id == current_user.id:
        logger.info(f"Client user {current_user.id} updating application status")
        # Clients can only update status
        if application_in.status is not None:
            # Validate status
            if application_in.status not in ["pending", "accepted", "rejected"]:
                logger.warning(f"Invalid status update: {application_in.status}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid status value",
                )
            
            # If accepting application, update gig
            if application_in.status == "accepted":
                logger.info(f"Application {application_id} accepted, updating gig {gig.id}")
                # Check if gig is still active
                if gig.status != "active":
                    logger.warning(f"Cannot accept application for non-active gig {gig.id}")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Cannot accept application for a gig that is not active",
                    )
                
                # Update gig status and hired creative
                gig.status = "hired"
                gig.hired_creative_id = application.creative_id
                db.add(gig)
                logger.info(f"Gig {gig.id} status updated to hired with creative {application.creative_id}")
                
                # Reject all other applications for this gig
                other_applications = db.query(Application).filter(
                    Application.gig_id == application.gig_id,
                    Application.id != application_id_uuid,
                    Application.status == "pending"
                ).all()
                
                rejected_count = 0
                for other_app in other_applications:
                    other_app.status = "rejected"
                    db.add(other_app)
                    rejected_count += 1
                
                db.commit()
                
                logger.info(f"Rejected {rejected_count} other applications for gig {gig.id}")
            
            application.status = application_in.status
    
    else:
        logger.warning(f"User {current_user.id} attempted to update application {application_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this application",
        )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    logger.info(f"Application {application_id} updated successfully by user {current_user.id}")
    return application


@router.get("/me/with-gig", response_model=List[ApplicationWithGig])
def get_my_applications_with_gig(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_creative_user)
) -> Any:
    """
    Get current user's applications with gig information.
    Only creatives can view their own applications.
    """
    logger.info(f"Fetching applications with gig info for creative user {current_user.id}")
    logger.debug(f"Pagination parameters: skip={skip}, limit={limit}")
    
    query = db.query(Application).filter(Application.creative_id == current_user.id)
    
    # Apply pagination
    applications = query.offset(skip).limit(limit).all()
    logger.debug(f"Found {len(applications)} applications for creative user {current_user.id}")
    return applications


@router.get("/client/me/with-gig", response_model=List[ApplicationWithGig])
def get_client_applications_with_gig(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_client_user)
) -> Any:
    """
    Get applications to current client's gigs with gig information.
    Only clients can view applications to their gigs.
    """
    logger.info(f"Fetching applications with gig info for client user {current_user.id}")
    logger.debug(f"Pagination parameters: skip={skip}, limit={limit}")
    
    # Get applications for gigs owned by this client
    query = db.query(Application).join(Gig).filter(Gig.client_id == current_user.id)
    
    # Apply pagination
    applications = query.offset(skip).limit(limit).all()
    logger.debug(f"Found {len(applications)} applications for client user {current_user.id}")
    return applications


@router.get("/{application_id}/with-details", response_model=ApplicationWithDetails)
def get_application_with_details(
    *,
    db: Session = Depends(get_db),
    application_id: str,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get a specific application by ID with both creative and gig information.
    """
    logger.info(f"Fetching application {application_id} with details for user {current_user.id}")
    
    # Convert string ID to UUID
    try:
        application_id_uuid = uuid.UUID(application_id)
    except ValueError:
        logger.warning(f"Invalid application ID format: {application_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID format",
        )
    
    # Get the application
    application = db.query(Application).filter(Application.id == application_id_uuid).first()
    if not application:
        logger.warning(f"Application {application_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # Check permissions (only the applicant or the gig owner can view)
    gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
    if application.creative_id != current_user.id and gig.client_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to access application {application_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this application",
        )
    
    logger.info(f"Application {application_id} with details found for user {current_user.id}")
    return application
