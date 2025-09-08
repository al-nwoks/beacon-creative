import logging
from typing import Any, List
import time

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate
from app.auth.dependencies import get_current_admin_user_dependency
from app.utils.performance import log_performance_metrics, log_query_performance

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/users", response_model=List[UserSchema])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency),
    skip: int = 0,
    limit: int = 100,
    role: str = Query(None, description="Filter users by role (creative, client, admin)"),
    search: str = Query(None, description="Search users by email or name")
) -> Any:
    """
    Get all users (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} fetching all users")
    logger.debug(f"Query parameters: skip={skip}, limit={limit}, role={role}, search={search}")
    
    query = db.query(User)
    
    # Apply role filter if provided
    if role:
        query = query.filter(User.role == role)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            User.email.ilike(search_term) |
            User.first_name.ilike(search_term) |
            User.last_name.ilike(search_term)
        )
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    query_start = time.time()
    users = query.all()
    query_end = time.time()
    log_query_performance("SELECT", "complex", query_end - query_start, len(users))
    
    logger.info(f"Found {len(users)} users for admin {current_user.id}")
    
    end_time = time.time()
    log_performance_metrics("get_all_users", start_time, end_time, {
        "user_count": len(users),
        "skip": skip,
        "limit": limit
    })
    return users


@router.get("/users/{user_id}", response_model=UserSchema)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency)
) -> Any:
    """
    Get a specific user by ID (admin only).
    """
    logger.info(f"Admin {current_user.id} fetching user {user_id}")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.warning(f"User {user_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    logger.info(f"User {user_id} found for admin {current_user.id}")
    return user


@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency)
) -> Any:
    """
    Update a user (admin only).
    """
    logger.info(f"Admin {current_user.id} updating user {user_id}")
    logger.debug(f"Update data: {user_in.dict(exclude_unset=True)}")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.warning(f"User {user_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if email is being updated and if it's already taken by another user
    if user_in.email is not None and user_in.email != user.email:
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user and existing_user.id != user_id:
            logger.warning(f"Email {user_in.email} already registered for another user")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Update user attributes
    for field, value in user_in.dict(exclude_unset=True).items():
        setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    logger.info(f"User {user_id} updated successfully by admin {current_user.id}")
    return user


@router.delete("/users/{user_id}", response_model=UserSchema)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency)
) -> Any:
    """
    Delete a user (admin only).
    """
    logger.info(f"Admin {current_user.id} deleting user {user_id}")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.warning(f"User {user_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from deleting themselves
    if user.id == current_user.id:
        logger.warning(f"Admin {current_user.id} attempted to delete themselves")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
    
    db.delete(user)
    db.commit()
    
    logger.info(f"User {user_id} deleted successfully by admin {current_user.id}")
    return user


@router.get("/stats", response_model=dict)
def get_platform_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency)
) -> Any:
    """
    Get platform statistics (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} fetching platform stats")
    
    # Get user counts by role
    query_start = time.time()
    user_stats = db.query(User.role, db.func.count(User.id)).group_by(User.role).all()
    query_end = time.time()
    log_query_performance("SELECT", "aggregate", query_end - query_start)
    
    # Convert to dict
    user_counts = {role: count for role, count in user_stats}
    
    # Get total users
    total_users = sum(user_counts.values())
    
    stats = {
        "total_users": total_users,
        "users_by_role": user_counts,
        "admins": user_counts.get("admin", 0),
        "creatives": user_counts.get("creative", 0),
        "clients": user_counts.get("client", 0)
    }
    
    end_time = time.time()
    log_performance_metrics("get_platform_stats", start_time, end_time)
    logger.info(f"Platform stats retrieved for admin {current_user.id}")
    return stats


# Import Project model and schemas
from app.models.project import Project
from app.schemas.project import Project as ProjectSchema, ProjectUpdate

@router.get("/projects", response_model=List[ProjectSchema])
def get_all_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency),
    skip: int = 0,
    limit: int = 100,
    status: str = Query(None, description="Filter projects by status"),
    search: str = Query(None, description="Search projects by title or description")
) -> Any:
    """
    Get all projects (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} fetching all projects")
    logger.debug(f"Query parameters: skip={skip}, limit={limit}, status={status}, search={search}")
    
    query = db.query(Project)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Project.status == status)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Project.title.ilike(search_term) |
            Project.description.ilike(search_term)
        )
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    query_start = time.time()
    projects = query.all()
    query_end = time.time()
    log_query_performance("SELECT", "complex", query_end - query_start, len(projects))
    
    logger.info(f"Found {len(projects)} projects for admin {current_user.id}")
    
    end_time = time.time()
    log_performance_metrics("get_all_projects", start_time, end_time, {
        "project_count": len(projects),
        "skip": skip,
        "limit": limit
    })
    return projects


@router.get("/projects/{project_id}", response_model=ProjectSchema)
def get_project_by_id(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency)
) -> Any:
    """
    Get a specific project by ID (admin only).
    """
    logger.info(f"Admin {current_user.id} fetching project {project_id}")
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        logger.warning(f"Project {project_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    logger.info(f"Project {project_id} found for admin {current_user.id}")
    return project


@router.put("/projects/{project_id}", response_model=ProjectSchema)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency)
) -> Any:
    """
    Update a project (admin only).
    """
    logger.info(f"Admin {current_user.id} updating project {project_id}")
    logger.debug(f"Update data: {project_in.dict(exclude_unset=True)}")
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        logger.warning(f"Project {project_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update project attributes
    for field, value in project_in.dict(exclude_unset=True).items():
        setattr(project, field, value)
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    logger.info(f"Project {project_id} updated successfully by admin {current_user.id}")
    return project


@router.delete("/projects/{project_id}", response_model=ProjectSchema)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency)
) -> Any:
    """
    Delete a project (admin only).
    """
    logger.info(f"Admin {current_user.id} deleting project {project_id}")
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        logger.warning(f"Project {project_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(project)
    db.commit()
    
    logger.info(f"Project {project_id} deleted successfully by admin {current_user.id}")
    return project


# Import Payment model and schemas
from app.models.payment import Payment
from app.schemas.payment import Payment as PaymentSchema

@router.get("/payments", response_model=List[PaymentSchema])
def get_all_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency),
    skip: int = 0,
    limit: int = 100,
    status: str = Query(None, description="Filter payments by status"),
    search: str = Query(None, description="Search payments by project ID or creative ID")
) -> Any:
    """
    Get all payments (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} fetching all payments")
    logger.debug(f"Query parameters: skip={skip}, limit={limit}, status={status}, search={search}")
    
    query = db.query(Payment)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Payment.status == status)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Payment.project_id.cast(String).ilike(search_term) |
            Payment.creative_id.cast(String).ilike(search_term)
        )
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    query_start = time.time()
    payments = query.all()
    query_end = time.time()
    log_query_performance("SELECT", "complex", query_end - query_start, len(payments))
    
    logger.info(f"Found {len(payments)} payments for admin {current_user.id}")
    
    end_time = time.time()
    log_performance_metrics("get_all_payments", start_time, end_time, {
        "payment_count": len(payments),
        "skip": skip,
        "limit": limit
    })
    return payments


@router.get("/payments/{payment_id}", response_model=PaymentSchema)
def get_payment_by_id(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency)
) -> Any:
    """
    Get a specific payment by ID (admin only).
    """
    import uuid
    logger.info(f"Admin {current_user.id} fetching payment {payment_id}")
    
    try:
        payment_id_uuid = uuid.UUID(payment_id)
    except ValueError:
        logger.warning(f"Invalid payment ID format: {payment_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment ID format"
        )
    
    payment = db.query(Payment).filter(Payment.id == payment_id_uuid).first()
    if not payment:
        logger.warning(f"Payment {payment_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    logger.info(f"Payment {payment_id} found for admin {current_user.id}")
    return payment


@router.put("/payments/{payment_id}/status", response_model=PaymentSchema)
def update_payment_status(
    payment_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user_dependency)
) -> Any:
    """
    Update a payment status (admin only).
    """
    import uuid
    logger.info(f"Admin {current_user.id} updating payment {payment_id} status to {status}")
    
    try:
        payment_id_uuid = uuid.UUID(payment_id)
    except ValueError:
        logger.warning(f"Invalid payment ID format: {payment_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment ID format"
        )
    
    payment = db.query(Payment).filter(Payment.id == payment_id_uuid).first()
    if not payment:
        logger.warning(f"Payment {payment_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Update payment status
    old_status = payment.status
    payment.status = status
    
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    logger.info(f"Payment {payment_id} status updated from {old_status} to {status} by admin {current_user.id}")
    return payment