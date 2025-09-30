import logging
from typing import Any, List
import time

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, String

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate, UserCreate
from app.auth.password import get_password_hash
from app.auth.dependencies import get_current_admin_user_dependency
from app.utils.performance import log_performance_metrics, log_query_performance
from app.utils.audit import log_admin_action, get_resource_values, create_audit_description
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLog as AuditLogSchema
from fastapi import Request

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/users", response_model=List[UserSchema])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency,
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
    current_user: User = get_current_admin_user_dependency
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
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency
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
    
    # Get old values for audit log
    old_values = get_resource_values(user)
    
    # Update user attributes
    for field, value in user_in.dict(exclude_unset=True).items():
        setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Get new values for audit log
    new_values = get_resource_values(user)
    
    # Log admin action
    log_admin_action(
        db=db,
        admin_user=current_user,
        action="UPDATE",
        resource_type="user",
        resource_id=str(user_id),
        description=create_audit_description("UPDATE", "user", new_values),
        old_values=old_values,
        new_values=new_values,
        request=request
    )
    
    logger.info(f"User {user_id} updated successfully by admin {current_user.id}")
    return user


@router.delete("/users/{user_id}", response_model=UserSchema)
def delete_user(
    user_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency
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
    
    # Get user values for audit log before deletion
    old_values = get_resource_values(user)
    
    db.delete(user)
    db.commit()
    
    # Log admin action
    log_admin_action(
        db=db,
        admin_user=current_user,
        action="DELETE",
        resource_type="user",
        resource_id=str(user_id),
        description=create_audit_description("DELETE", "user", old_values),
        old_values=old_values,
        request=request
    )
    
    logger.info(f"User {user_id} deleted successfully by admin {current_user.id}")
    return user


@router.get("/stats", response_model=dict)
def get_platform_stats(
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency
) -> Any:
    """
    Get platform statistics (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} fetching platform stats")
    
    # Get user counts by role
    query_start = time.time()
    user_stats = db.query(User.role, func.count(User.id)).group_by(User.role).all()
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


# Import Gig model and schemas
from app.models.gig import Gig
from app.schemas.gig import Gig as GigSchema, GigUpdate

@router.get("/gigs", response_model=List[GigSchema])
def get_all_gigs(
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency,
    skip: int = 0,
    limit: int = 100,
    status: str = Query(None, description="Filter gigs by status"),
    search: str = Query(None, description="Search gigs by title or description")
) -> Any:
    """
    Get all gigs (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} fetching all gigs")
    logger.debug(f"Query parameters: skip={skip}, limit={limit}, status={status}, search={search}")
    
    query = db.query(Gig)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Gig.status == status)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Gig.title.ilike(search_term) |
            Gig.description.ilike(search_term)
        )
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    query_start = time.time()
    gigs = query.all()
    query_end = time.time()
    log_query_performance("SELECT", "complex", query_end - query_start, len(gigs))
    
    logger.info(f"Found {len(gigs)} gigs for admin {current_user.id}")
    
    end_time = time.time()
    log_performance_metrics("get_all_gigs", start_time, end_time, {
        "gig_count": len(gigs),
        "skip": skip,
        "limit": limit
    })
    return gigs


@router.get("/gigs/{gig_id}", response_model=GigSchema)
def get_gig_by_id(
    gig_id: str,
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency
) -> Any:
    """
    Get a specific gig by ID (admin only).
    """
    import uuid
    logger.info(f"Admin {current_user.id} fetching gig {gig_id}")
    
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
        logger.warning(f"Gig {gig_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )
    
    logger.info(f"Gig {gig_id} found for admin {current_user.id}")
    return gig


@router.put("/gigs/{gig_id}", response_model=GigSchema)
def update_gig(
    gig_id: str,
    gig_in: GigUpdate,
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency
) -> Any:
    """
    Update a gig (admin only).
    """
    import uuid
    logger.info(f"Admin {current_user.id} updating gig {gig_id}")
    logger.debug(f"Update data: {gig_in.dict(exclude_unset=True)}")
    
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
        logger.warning(f"Gig {gig_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )
    
    # Update gig attributes
    for field, value in gig_in.dict(exclude_unset=True).items():
        setattr(gig, field, value)
    
    db.add(gig)
    db.commit()
    db.refresh(gig)
    
    logger.info(f"Gig {gig_id} updated successfully by admin {current_user.id}")
    return gig


@router.delete("/gigs/{gig_id}", response_model=GigSchema)
def delete_gig(
    gig_id: str,
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency
) -> Any:
    """
    Delete a gig (admin only).
    """
    import uuid
    logger.info(f"Admin {current_user.id} deleting gig {gig_id}")
    
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
        logger.warning(f"Gig {gig_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )
    
    db.delete(gig)
    db.commit()
    
    logger.info(f"Gig {gig_id} deleted successfully by admin {current_user.id}")
    return gig


# Import Payment model and schemas
from app.models.payment import Payment
from app.schemas.payment import Payment as PaymentSchema

@router.get("/payments", response_model=List[PaymentSchema])
def get_all_payments(
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency,
    skip: int = 0,
    limit: int = 100,
    status: str = Query(None, description="Filter payments by status"),
    search: str = Query(None, description="Search payments by gig ID or creative ID")
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
            Payment.gig_id.cast(String).ilike(search_term) |
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
    current_user: User = get_current_admin_user_dependency
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
    current_user: User = get_current_admin_user_dependency
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


@router.post("/users", response_model=UserSchema)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    request: Request,
    current_user: User = get_current_admin_user_dependency
) -> Any:
    """
    Create a new user (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} creating new user with email: {user_in.email}")
    logger.debug(f"User data: role={user_in.role}, first_name={user_in.first_name}, last_name={user_in.last_name}")
    
    # Check if email is already registered
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        logger.warning(f"User creation failed: Email {user_in.email} already registered")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
        bio=user_in.bio,
        location=user_in.location,
        profile_image_url=user_in.profile_image_url,
        hourly_rate=user_in.hourly_rate,
        skills=user_in.skills,
        portfolio_links=user_in.portfolio_links,
        portfolio_images=user_in.portfolio_images,
        creative_type=user_in.creative_type,
        is_active=user_in.is_active,
        is_verified=user_in.is_verified,
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Get new values for audit log
    new_values = get_resource_values(db_user)
    
    # Log admin action
    log_admin_action(
        db=db,
        admin_user=current_user,
        action="CREATE",
        resource_type="user",
        resource_id=str(db_user.id),
        description=create_audit_description("CREATE", "user", new_values),
        new_values=new_values,
        request=request
    )
    
    end_time = time.time()
    log_performance_metrics("create_user", start_time, end_time)
    
    logger.info(f"User created successfully with ID: {db_user.id} by admin {current_user.id}")
    return db_user


@router.put("/users/{user_id}/suspend", response_model=UserSchema)
def suspend_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency
) -> Any:
    """
    Suspend a user (admin only).
    """
    logger.info(f"Admin {current_user.id} suspending user {user_id}")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.warning(f"User {user_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from suspending themselves
    if user.id == current_user.id:
        logger.warning(f"Admin {current_user.id} attempted to suspend themselves")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot suspend yourself"
        )
    
    # Suspend user
    user.is_active = False
    db.add(user)
    db.commit()
    db.refresh(user)
    
    logger.info(f"User {user_id} suspended successfully by admin {current_user.id}")
    return user


@router.put("/users/{user_id}/activate", response_model=UserSchema)
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency
) -> Any:
    """
    Activate a user (admin only).
    """
    logger.info(f"Admin {current_user.id} activating user {user_id}")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.warning(f"User {user_id} not found for admin {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Activate user
    user.is_active = True
    db.add(user)
    db.commit()
    db.refresh(user)
    
    logger.info(f"User {user_id} activated successfully by admin {current_user.id}")
    return user


@router.get("/analytics", response_model=dict)
def get_platform_analytics(
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency,
    days: int = Query(30, description="Number of days to analyze")
) -> Any:
    """
    Get platform analytics data (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} fetching platform analytics for {days} days")
    
    from datetime import datetime, timedelta
    from sqlalchemy import and_
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # Get user registration data over time
    user_growth = db.query(
        func.date(User.created_at).label('date'),
        func.count(User.id).label('count')
    ).filter(
        User.created_at >= start_date
    ).group_by(
        func.date(User.created_at)
    ).order_by(
        func.date(User.created_at)
    ).all()
    
    # Get gig creation data over time
    gig_growth = db.query(
        func.date(Gig.created_at).label('date'),
        func.count(Gig.id).label('count')
    ).filter(
        Gig.created_at >= start_date
    ).group_by(
        func.date(Gig.created_at)
    ).order_by(
        func.date(Gig.created_at)
    ).all()
    
    # Get payment data over time
    payment_data = db.query(
        func.date(Payment.created_at).label('date'),
        func.sum(Payment.amount).label('amount')
    ).filter(
        Payment.created_at >= start_date
    ).group_by(
        func.date(Payment.created_at)
    ).order_by(
        func.date(Payment.created_at)
    ).all()
    
    analytics = {
        "user_growth": [{"date": str(date), "count": count} for date, count in user_growth],
        "gig_growth": [{"date": str(date), "count": count} for date, count in gig_growth],
        "payment_data": [{"date": str(date), "amount": float(amount or 0)} for date, amount in payment_data],
        "date_range": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat(),
            "days": days
        }
    }
    
    end_time = time.time()
    log_performance_metrics("get_platform_analytics", start_time, end_time)
    
    logger.info(f"Platform analytics retrieved for admin {current_user.id}")
    return analytics


@router.get("/audit-logs", response_model=List[AuditLogSchema])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency,
    skip: int = 0,
    limit: int = 100,
    action: str = Query(None, description="Filter by action type"),
    resource_type: str = Query(None, description="Filter by resource type"),
    admin_user_id: int = Query(None, description="Filter by admin user ID")
) -> Any:
    """
    Get audit logs (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} fetching audit logs")
    logger.debug(f"Query parameters: skip={skip}, limit={limit}, action={action}, resource_type={resource_type}, admin_user_id={admin_user_id}")
    
    query = db.query(AuditLog)
    
    # Apply filters
    if action:
        query = query.filter(AuditLog.action == action.upper())
    
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type.lower())
    
    if admin_user_id:
        query = query.filter(AuditLog.admin_user_id == admin_user_id)
    
    # Order by created_at descending and apply pagination
    query = query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit)
    
    query_start = time.time()
    audit_logs = query.all()
    query_end = time.time()
    log_query_performance("SELECT", "complex", query_end - query_start, len(audit_logs))
    
    logger.info(f"Found {len(audit_logs)} audit logs for admin {current_user.id}")
    
    end_time = time.time()
    log_performance_metrics("get_audit_logs", start_time, end_time, {
        "log_count": len(audit_logs),
        "skip": skip,
        "limit": limit
    })
    return audit_logs


@router.get("/recent-activity", response_model=List[dict])
def get_recent_activity(
    db: Session = Depends(get_db),
    current_user: User = get_current_admin_user_dependency,
    limit: int = Query(10, description="Number of recent activities to return")
) -> Any:
    """
    Get recent platform activity for dashboard (admin only).
    """
    start_time = time.time()
    logger.info(f"Admin {current_user.id} fetching recent activity")
    
    # Get recent audit logs with admin user info
    recent_logs = db.query(AuditLog).join(
        User, AuditLog.admin_user_id == User.id
    ).order_by(
        AuditLog.created_at.desc()
    ).limit(limit).all()
    
    # Format activity data
    activities = []
    for log in recent_logs:
        activities.append({
            "id": str(log.id),
            "action": log.description or f"{log.action} {log.resource_type}",
            "admin_name": f"{log.admin_user.first_name} {log.admin_user.last_name}",
            "admin_email": log.admin_user.email,
            "time": log.created_at.isoformat(),
            "resource_type": log.resource_type,
            "resource_id": log.resource_id
        })
    
    end_time = time.time()
    log_performance_metrics("get_recent_activity", start_time, end_time)
    
    logger.info(f"Recent activity retrieved for admin {current_user.id}")
    return activities