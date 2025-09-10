from typing import Optional
from datetime import datetime
from pydantic import BaseModel, UUID4, validator

from app.schemas.user import User
from app.schemas.gig import Gig

# Shared properties
class PaymentBase(BaseModel):
    amount: float
    milestone_description: Optional[str] = None

# Properties to receive via API on creation
class PaymentCreate(PaymentBase):
    gig_id: str
    creative_id: str

# Properties to receive via API on update
class PaymentUpdate(BaseModel):
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v not in ["pending", "held_in_escrow", "released", "refunded"]:
            raise ValueError('Invalid status value')
        return v

# Properties shared by models stored in DB
class PaymentInDBBase(PaymentBase):
    id: UUID4
    gig_id: UUID4
    client_id: int
    creative_id: int
    stripe_payment_intent_id: Optional[str] = None
    status: str
    created_at: datetime
    released_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Properties to return via API
class Payment(PaymentInDBBase):
    pass

# Properties to return via API with client info
class PaymentWithClient(Payment):
    client: User

# Properties to return via API with creative info
class PaymentWithCreative(Payment):
    creative: User

# Properties to return via API with gig info
class PaymentWithGig(Payment):
    gig: Gig

# Properties to return via API with all related info
class PaymentWithDetails(Payment):
    client: User
    creative: User
    gig: Gig

# Properties stored in DB
class PaymentInDB(PaymentInDBBase):
    pass

# Stripe payment intent creation response
class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
