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

@router.get("/", response_model=List[GigSchema])
def get_gigs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Retrieve gigs.
    """
    start_time = time.time()
    logger.info(f"Fetching gigs for user {current_user.id}")
    
    query_start = time.time()
    gigs = db.query(Gig).offset(skip).limit(limit).all()
    query_end = time.time()
    log_query_performance("SELECT", "simple", query_end - query_start, len(gigs))
    
    logger.debug(f"Found {len(gigs)} gigs")
    
    end_time = time.time()
    log_performance_metrics("get_gigs", start_time, end_time, {
        "gig_count": len(gigs),
        "skip": skip,
        "limit": limit
    })
    return gigs


@router.post("/", response_model=GigSchema)
def create_gig(
    *,
    db: Session = Depends(get_db),
    gig_in: GigCreate,
    current_user: User = Depends(get_current_client_user_dependency)
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
    gig_id: int,
    current_user: User = Depends(get_current_active_user_dependency)
) -> Any:
    """
    Get gig by ID.
    """
    logger.info(f"Fetching gig {gig_id} for user {current_user.id}")
    
    gig = db.query(Gig).filter(Gig.id == gig_id).first()
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
    gig_id: int,
    gig_in: GigUpdate,
    current_user: User = Depends(get_current_client_user_dependency)
) -> Any:
    """
    Update a gig.
    Only the client who created the gig can update it.
    """
    logger.info(f"Updating gig {gig_id} for client user {current_user.id}")
    
    gig = db.query(Gig).filter(Gig.id == gig_id).first()
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
    gig_id: int,
    current_user: User = Depends(get_current_client_user_dependency)
) -> Any:
    """
    Delete a gig.
    Only the client who created the gig can delete it.
    """
    logger.info(f"Deleting gig {gig_id} for client user {current_user.id}")
    
    gig = db.query(Gig).filter(Gig.id == gig_id).first()
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
    current_user: User = Depends(get_current_client_user_dependency)
) -> Any:
    """
    Get current user's gigs.
    Only clients can view their own gigs.
    """
    logger.info(f"Fetching gigs for client user {current_user.id}")
    
    query = db.query(Gig).filter(Gig.client_id == current_user.id)
    if status:
        query = query.filter(Gig.status == status)
    
    gigs = query.all()
    logger.debug(f"Found {len(gigs)} gigs for client user {current_user.id}")
    return gigs
