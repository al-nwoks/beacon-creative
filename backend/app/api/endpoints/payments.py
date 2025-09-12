import logging
import uuid
from typing import Any, List
import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.gig import Gig
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentWithDetails, PaymentIntentResponse
from app.auth.dependencies import get_current_active_user_dependency, get_current_client_user
from app.utils.performance import log_performance_metrics, log_query_performance

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=PaymentIntentResponse)
def create_payment_intent(
    *,
    db: Session = Depends(get_db),
    payment_in: PaymentCreate,
    current_user: User = Depends(get_current_client_user)
) -> Any:
    """
    Create a payment intent for a gig (client only).
    """
    start_time = time.time()
    logger.info(f"Creating payment intent for gig ID: {payment_in.gig_id} by user ID: {current_user.id}")
    logger.debug(f"Payment data: amount={payment_in.amount}, creative_id={payment_in.creative_id}, milestone_description={payment_in.milestone_description}")
    
    # Check if gig exists
    gig = db.query(Gig).filter(Gig.id == payment_in.gig_id).first()
    if not gig:
        logger.warning(f"Payment intent creation failed: Gig {payment_in.gig_id} not found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found",
        )
    
    # Check if user is the gig client
    if gig.client_id != current_user.id:
        logger.warning(f"Payment intent creation failed: User {current_user.id} is not the client for gig {payment_in.gig_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the gig client can create payments",
        )
    
    # Check if gig is in a state where payments can be made
    if gig.status not in ["hired", "completed"]:
        logger.warning(f"Payment intent creation failed: Gig {payment_in.gig_id} is not in a valid state for payments (status: {gig.status})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payments can only be made for hired or completed gigs",
        )
    
    # Check if creative exists
    creative = db.query(User).filter(User.id == payment_in.creative_id).first()
    if not creative:
        logger.warning(f"Payment intent creation failed: Creative {payment_in.creative_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creative not found",
        )
    
    # Check if creative is the hired creative for the gig
    if gig.hired_creative_id != creative.id:
        logger.warning(f"Payment intent creation failed: Creative {payment_in.creative_id} is not hired for gig {payment_in.gig_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Creative is not hired for this gig",
        )
    
    # Convert string IDs to UUIDs
    gig_id_uuid = uuid.UUID(payment_in.gig_id)
    creative_id_uuid = uuid.UUID(payment_in.creative_id)
    
    # Create payment record
    db_payment = Payment(
        gig_id=gig_id_uuid,
        client_id=current_user.id,
        creative_id=creative_id_uuid,
        amount=payment_in.amount,
        milestone_description=payment_in.milestone_description,
        status="pending"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    end_time = time.time()
    log_performance_metrics("create_payment_intent", start_time, end_time)
    
    logger.info(f"Payment intent created successfully with ID: {db_payment.id}")
    return PaymentIntentResponse(
        client_secret="test_client_secret",  # In a real implementation, this would come from Stripe
        payment_intent_id=str(db_payment.id)
    )


@router.get("/gig/{gig_id}", response_model=List[PaymentWithDetails])
def get_gig_payments(
    *,
    db: Session = Depends(get_db),
    gig_id: str,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get all payments for a specific gig.
    """
    logger.info(f"Fetching payments for gig {gig_id} for user ID: {current_user.id}")
    
    # Check if gig exists
    gig_id_uuid = uuid.UUID(gig_id)
    gig = db.query(Gig).filter(Gig.id == gig_id_uuid).first()
    if not gig:
        logger.warning(f"Gig payments fetch failed: Gig {gig_id} not found for user ID: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found",
        )
    
    # Check if user is involved in the gig
    if gig.client_id != current_user.id and gig.hired_creative_id != current_user.id:
        logger.warning(f"Gig payments fetch failed: User {current_user.id} is not involved in gig {gig_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to view payments for this gig",
        )
    
    # Get all payments for the gig
    payments = db.query(Payment).filter(Payment.gig_id == gig_id_uuid).all()
    logger.info(f"Found {len(payments)} payments for gig {gig_id}")
    return payments


@router.get("/{payment_id}", response_model=PaymentWithDetails)
def get_payment(
    *,
    db: Session = Depends(get_db),
    payment_id: str,
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get a specific payment by ID.
    """
    logger.info(f"Fetching payment {payment_id} for user {current_user.id}")
    
    # Convert string ID to UUID
    try:
        payment_id_uuid = uuid.UUID(payment_id)
    except ValueError:
        logger.warning(f"Invalid payment ID format: {payment_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment ID format",
        )
    
    # Get the payment
    payment = db.query(Payment).filter(Payment.id == payment_id_uuid).first()
    if not payment:
        logger.warning(f"Payment {payment_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )
    
    # Get the gig
    gig = db.query(Gig).filter(Gig.id == payment.gig_id).first()
    
    # Check if user is involved in the payment
    if payment.client_id != current_user.id and payment.creative_id != current_user.id:
        logger.warning(f"User {current_user.id} attempted to access payment {payment_id} without permission")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this payment",
        )
    
    logger.info(f"Payment {payment_id} found for user {current_user.id}")
    return payment


@router.put("/{payment_id}/release", response_model=PaymentWithDetails)
def release_payment(
    *,
    db: Session = Depends(get_db),
    payment_id: str,
    current_user: User = Depends(get_current_client_user)
) -> Any:
    """
    Release a payment to the creative (client only).
    """
    logger.info(f"Releasing payment {payment_id} by client user {current_user.id}")
    
    # Convert string ID to UUID
    try:
        payment_id_uuid = uuid.UUID(payment_id)
    except ValueError:
        logger.warning(f"Invalid payment ID format: {payment_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment ID format",
        )
    
    # Get the payment
    payment = db.query(Payment).filter(Payment.id == payment_id_uuid).first()
    if not payment:
        logger.warning(f"Payment release failed: Payment {payment_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )
    
    # Check if user is the client for this payment
    if payment.client_id != current_user.id:
        logger.warning(f"Payment release failed: User {current_user.id} is not the client for payment {payment_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the client can release this payment",
        )
    
    # Check if payment is in a state that can be released
    if payment.status != "held_in_escrow":
        logger.warning(f"Payment release failed: Payment {payment_id} is not in escrow (status: {payment.status})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment is not in escrow",
        )
    
    # Update payment status
    payment.status = "released"
    payment.released_at = time.time()
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    logger.info(f"Payment {payment_id} released successfully by client user {current_user.id}")
    return payment


@router.get("/me", response_model=List[PaymentWithDetails])
def get_my_payments(
    *,
    db: Session = Depends(get_db),
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get all payments for the current user (either as client or creative).
    """
    logger.info(f"Fetching payments for user {current_user.id}")
    
    # Get all payments where user is either client or creative
    payments = db.query(Payment).filter(
        (Payment.client_id == current_user.id) | (Payment.creative_id == current_user.id)
    ).all()
    
    logger.info(f"Found {len(payments)} payments for user {current_user.id}")
    return payments
