import logging
from typing import Any, List, Optional
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.payment import Payment
from app.schemas.payment import (
    Payment as PaymentSchema,
    PaymentCreate,
    PaymentUpdate,
    PaymentWithClient,
    PaymentWithCreative,
    PaymentWithProject,
    PaymentWithDetails,
    PaymentIntentResponse
)
from app.auth.dependencies import (
    get_current_active_user,
    get_current_client_user,
    get_current_creative_user
)
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/create-intent", response_model=PaymentIntentResponse)
def create_payment_intent(
    *,
    db: Session = Depends(get_db),
    payment_in: PaymentCreate,
    current_user: User = Depends(get_current_client_user),
) -> Any:
    """
    Create a payment intent (client only).
    """
    logger.info(f"Creating payment intent for project ID: {payment_in.project_id} by user ID: {current_user.id}")
    logger.debug(f"Payment data: amount={payment_in.amount}, creative_id={payment_in.creative_id}, milestone_description={payment_in.milestone_description}")
    
    # Check if project exists
    project = db.query(Project).filter(Project.id == payment_in.project_id).first()
    if not project:
        logger.warning(f"Payment intent creation failed: Project {payment_in.project_id} not found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    # Check if user is the project client
    if project.client_id != current_user.id:
        logger.warning(f"Payment intent creation failed: User {current_user.id} is not the client for project {payment_in.project_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if project is in a state where payments can be made
    if project.status not in ["hired", "completed"]:
        logger.warning(f"Payment intent creation failed: Project {payment_in.project_id} is not in a valid state for payments (status: {project.status})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payments can only be made for hired or completed projects",
        )
    
    # Check if creative exists
    creative = db.query(User).filter(User.id == payment_in.creative_id).first()
    if not creative:
        logger.warning(f"Payment intent creation failed: Creative {payment_in.creative_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creative not found",
        )
    
    # Check if creative is the hired creative for the project
    if project.hired_creative_id != creative.id:
        logger.warning(f"Payment intent creation failed: Creative {payment_in.creative_id} is not hired for project {payment_in.project_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Creative is not hired for this project",
        )
    
    # TODO: Implement Stripe payment intent creation
    # For now, we'll just create a placeholder payment record
    
    # Convert string IDs to UUIDs
    project_id_uuid = uuid.UUID(payment_in.project_id)
    creative_id_uuid = uuid.UUID(payment_in.creative_id)
    
    # Create payment record
    db_payment = Payment(
        project_id=project_id_uuid,
        client_id=current_user.id,
        creative_id=creative_id_uuid,
        amount=payment_in.amount,
        milestone_description=payment_in.milestone_description,
        stripe_payment_intent_id="pi_placeholder",  # Placeholder
        status="pending"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    logger.info(f"Payment intent created successfully with payment ID: {db_payment.id}")
    
    # Return payment intent details
    return {
        "client_secret": "cs_test_placeholder",  # Placeholder
        "payment_intent_id": "pi_placeholder"  # Placeholder
    }

@router.post("/confirm", response_model=PaymentSchema)
def confirm_payment(
    *,
    db: Session = Depends(get_db),
    payment_intent_id: str,
    current_user: User = Depends(get_current_client_user),
) -> Any:
    """
    Confirm a payment after successful Stripe payment (client only).
    """
    # Find payment by intent ID
    payment = db.query(Payment).filter(Payment.stripe_payment_intent_id == payment_intent_id).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )
    
    # Check if user is the payment client
    if payment.client_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if payment is in pending status
    if payment.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment is not in pending status",
        )
    
    # Update payment status to held in escrow
    payment.status = "held_in_escrow"
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment

@router.post("/release/{payment_id}", response_model=PaymentSchema)
def release_payment(
    *,
    db: Session = Depends(get_db),
    payment_id: str,
    current_user: User = Depends(get_current_client_user),
) -> Any:
    """
    Release a payment from escrow to the creative (client only).
    """
    logger.info(f"Releasing payment ID: {payment_id} by user ID: {current_user.id}")
    
    payment_id_uuid = uuid.UUID(payment_id)
    payment = db.query(Payment).filter(Payment.id == payment_id_uuid).first()
    if not payment:
        logger.warning(f"Payment release failed: Payment {payment_id} not found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )
    
    # Check if user is the payment client
    if payment.client_id != current_user.id:
        logger.warning(f"Payment release failed: User {current_user.id} is not the client for payment {payment_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Check if payment is in held_in_escrow status
    if payment.status != "held_in_escrow":
        logger.warning(f"Payment release failed: Payment {payment_id} is not in escrow (status: {payment.status})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment is not in escrow",
        )
    
    # Update payment status to released
    payment.status = "released"
    payment.released_at = datetime.utcnow()
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    logger.info(f"Payment released successfully: {payment_id}")
    return payment

@router.get("/project/{project_id}", response_model=List[PaymentWithDetails])
def get_project_payments(
    *,
    db: Session = Depends(get_db),
    project_id: str,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get all payments for a specific project.
    """
    # Check if project exists
    project_id_uuid = uuid.UUID(project_id)
    project = db.query(Project).filter(Project.id == project_id_uuid).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    # Check if user is involved in the project
    if project.client_id != current_user.id and project.hired_creative_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Get all payments for the project
    payments = db.query(Payment).filter(Payment.project_id == project_id_uuid).all()
    return payments

@router.get("/me", response_model=List[PaymentWithProject])
def get_my_payments(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    status: Optional[str] = None,
) -> Any:
    """
    Get all payments for the current user (as client or creative).
    """
    # Base query
    if current_user.role == "client":
        query = db.query(Payment).filter(Payment.client_id == current_user.id)
    else:
        query = db.query(Payment).filter(Payment.creative_id == current_user.id)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Payment.status == status)
    
    payments = query.all()
    return payments

@router.get("/{payment_id}", response_model=PaymentWithDetails)
def get_payment(
    *,
    db: Session = Depends(get_db),
    payment_id: str,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get a specific payment by id.
    """
    payment_id_uuid = uuid.UUID(payment_id)
    payment = db.query(Payment).filter(Payment.id == payment_id_uuid).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )
    
    # Check if user is involved in the payment
    if payment.client_id != current_user.id and payment.creative_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    return payment
