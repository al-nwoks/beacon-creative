from typing import Any, List
import logging
import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.gig import Gig
from app.schemas.gig import GigCreate, GigUpdate, Gig as GigSchema
from app.auth.dependencies import get_current_active_user_dependency, get_current_client_user_dependency
from app.models.user import User
from app.utils.performance import log_performance_metrics, log_query_performance

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
def get_gigs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    category: str = None,
    status: str = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Retrieve gigs with filtering, search, and pagination.
    """
    start_time = time.time()
    logger.info(f"Fetching gigs for user {current_user.id} with filters: search={search}, category={category}, status={status}")
    
    query_start = time.time()
    
    # Build base query
    query = db.query(Gig)
    
    # Apply filters
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Gig.title.ilike(search_term) |
            Gig.description.ilike(search_term)
        )
    
    if category:
        query = query.filter(Gig.category.ilike(f"%{category}%"))
    
    if status:
        query = query.filter(Gig.status == status)
    
    # Get total count before pagination
    total_count = query.count()
    
    # Apply sorting
    if sort_by == "created_at":
        if sort_order == "desc":
            query = query.order_by(Gig.created_at.desc())
        else:
            query = query.order_by(Gig.created_at.asc())
    elif sort_by == "budget_max":
        if sort_order == "desc":
            query = query.order_by(Gig.budget_max.desc().nullslast())
        else:
            query = query.order_by(Gig.budget_max.asc().nullsfirst())
    elif sort_by == "title":
        if sort_order == "desc":
            query = query.order_by(Gig.title.desc())
        else:
            query = query.order_by(Gig.title.asc())
    
    # Apply pagination
    gigs = query.offset(skip).limit(limit).all()
    
    query_end = time.time()
    log_query_performance("SELECT", "filtered", query_end - query_start, len(gigs))
    
    logger.debug(f"Found {len(gigs)} gigs out of {total_count} total")
    
    # Calculate pagination metadata
    has_more = (skip + len(gigs)) < total_count
    current_page = (skip // limit) + 1 if limit > 0 else 1
    total_pages = (total_count + limit - 1) // limit if limit > 0 else 1
    
    end_time = time.time()
    log_performance_metrics("get_gigs", start_time, end_time, {
        "gig_count": len(gigs),
        "total_count": total_count,
        "skip": skip,
        "limit": limit,
        "search": search,
        "category": category,
        "status": status
    })
    
    # Convert gigs to dict format for proper serialization
    gigs_data = []
    for gig in gigs:
        gig_dict = {
            "id": str(gig.id),
            "title": gig.title,
            "description": gig.description,
            "category": gig.category,
            "budget_min": gig.budget_min,
            "budget_max": gig.budget_max,
            "timeline_weeks": gig.timeline_weeks,
            "required_skills": gig.required_skills or [],
            "status": gig.status,
            "client_id": gig.client_id,
            "hired_creative_id": gig.hired_creative_id,
            "created_at": gig.created_at.isoformat() if gig.created_at else None,
            "updated_at": gig.updated_at.isoformat() if gig.updated_at else None
        }
        gigs_data.append(gig_dict)
    
    return {
        "items": gigs_data,
        "total": total_count,
        "page": current_page,
        "pages": total_pages,
        "limit": limit,
        "has_more": has_more
    }


@router.post("/", response_model=GigSchema)
def create_gig(
    *,
    db: Session = Depends(get_db),
    gig_in: GigCreate,
    current_user: User = get_current_client_user_dependency
) -> Any:
    """
    Create new gig.
    Only clients can create gigs.
    """
    start_time = time.time()
    logger.info(f"Creating gig for client user {current_user.id}")
    logger.debug(f"Gig data: {gig_in.dict()}")
    
    db_gig = Gig(
        title=gig_in.title,
        description=gig_in.description,
        category=gig_in.category,
        budget_min=gig_in.budget_min,
        budget_max=gig_in.budget_max,
        timeline_weeks=gig_in.timeline_weeks,
        client_id=current_user.id,
        required_skills=gig_in.required_skills or []
    )
    db.add(db_gig)
    db.commit()
    db.refresh(db_gig)
    
    end_time = time.time()
    log_performance_metrics("create_gig", start_time, end_time)
    logger.info(f"Gig created successfully with ID: {db_gig.id}")
    return db_gig


@router.get("/{gig_id}", response_model=GigSchema)
def get_gig(
    *,
    db: Session = Depends(get_db),
    gig_id: str,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get gig by ID.
    """
    import uuid
    logger.info(f"Fetching gig {gig_id} for user {current_user.id}")
    
    try:
        gig_id_uuid = uuid.UUID(gig_id)
    except ValueError:
        logger.warning(f"Invalid gig ID format: {gig_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid gig ID format"
        )
    
    gig = db.query(Gig).filter(Gig.id == gig_id_uuid).first()
    if not gig:
        logger.warning(f"Gig {gig_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )
    
    # Check if user has permission to view this gig
    if current_user.role == "client" and gig.client_id != current_user.id:
        logger.warning(f"Client user {current_user.id} attempted to access gig {gig_id} belonging to another client")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this gig"
        )
    
    logger.debug(f"Gig {gig_id} found")
    return gig


@router.put("/{gig_id}", response_model=GigSchema)
def update_gig(
    *,
    db: Session = Depends(get_db),
    gig_id: str,
    gig_in: GigUpdate,
    current_user: User = get_current_client_user_dependency
) -> Any:
    """
    Update a gig.
    Only the client who created the gig can update it.
    """
    import uuid
    logger.info(f"Updating gig {gig_id} for client user {current_user.id}")
    
    try:
        gig_id_uuid = uuid.UUID(gig_id)
    except ValueError:
        logger.warning(f"Invalid gig ID format: {gig_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid gig ID format"
        )
    
    gig = db.query(Gig).filter(Gig.id == gig_id_uuid).first()
    if not gig:
        logger.warning(f"Gig {gig_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )
    
    # Check if user is the owner of the gig
    if gig.client_id != current_user.id:
        logger.warning(f"Client user {current_user.id} attempted to update gig {gig_id} belonging to another client")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this gig"
        )
    
    # Update gig attributes
    for field, value in gig_in.dict(exclude_unset=True).items():
        setattr(gig, field, value)
    
    db.add(gig)
    db.commit()
    db.refresh(gig)
    
    logger.info(f"Gig {gig_id} updated successfully")
    return gig


@router.delete("/{gig_id}", response_model=GigSchema)
def delete_gig(
    *,
    db: Session = Depends(get_db),
    gig_id: str,
    current_user: User = get_current_client_user_dependency
) -> Any:
    """
    Delete a gig.
    Only the client who created the gig can delete it.
    """
    import uuid
    logger.info(f"Deleting gig {gig_id} for client user {current_user.id}")
    
    try:
        gig_id_uuid = uuid.UUID(gig_id)
    except ValueError:
        logger.warning(f"Invalid gig ID format: {gig_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid gig ID format"
        )
    
    gig = db.query(Gig).filter(Gig.id == gig_id_uuid).first()
    if not gig:
        logger.warning(f"Gig {gig_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )
    
    # Check if user is the owner of the gig
    if gig.client_id != current_user.id:
        logger.warning(f"Client user {current_user.id} attempted to delete gig {gig_id} belonging to another client")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this gig"
        )
    
    db.delete(gig)
    db.commit()
    
    logger.info(f"Gig {gig_id} deleted successfully")
    return gig


@router.get("/my-gigs", response_model=List[GigSchema])
def get_my_gigs(
    *,
    db: Session = Depends(get_db),
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = get_current_client_user_dependency
) -> Any:
    """
    Get current user's gigs with pagination.
    Only clients can view their own gigs.
    """
    logger.info(f"Fetching gigs for client user {current_user.id}")
    logger.debug(f"Pagination parameters: skip={skip}, limit={limit}, status={status}")
    
    query = db.query(Gig).filter(Gig.client_id == current_user.id)
    if status:
        query = query.filter(Gig.status == status)
    
    # Apply pagination
    gigs = query.offset(skip).limit(limit).all()
    logger.debug(f"Found {len(gigs)} gigs for client user {current_user.id}")
    return gigs
