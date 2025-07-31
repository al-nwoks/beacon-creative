from sqlalchemy import Column, String, Float, DateTime, ForeignKey, func, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.database import Base

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    client_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    creative_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stripe_payment_intent_id = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    milestone_description = Column(String, nullable=True)
    status = Column(
        Enum("pending", "held_in_escrow", "released", "refunded", name="payment_status"),
        default="pending",
        nullable=False
    )
    created_at = Column(DateTime, default=func.now())
    released_at = Column(DateTime, nullable=True)
    
    # Relationships
    project = relationship("Project", backref="payments")
    client = relationship("User", foreign_keys=[client_id], backref="sent_payments")
    creative = relationship("User", foreign_keys=[creative_id], backref="received_payments")
    
    def __repr__(self):
        return f"<Payment {self.id}>"
