"""
Audit logging utilities for tracking admin actions.
"""

import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi import Request

from app.models.audit_log import AuditLog
from app.models.user import User

logger = logging.getLogger(__name__)

def log_admin_action(
    db: Session,
    admin_user: User,
    action: str,
    resource_type: str,
    resource_id: str,
    description: Optional[str] = None,
    old_values: Optional[Dict[str, Any]] = None,
    new_values: Optional[Dict[str, Any]] = None,
    request: Optional[Request] = None
) -> None:
    """
    Log an admin action to the audit log.
    
    Args:
        db: Database session
        admin_user: The admin user performing the action
        action: The action being performed (CREATE, UPDATE, DELETE, etc.)
        resource_type: Type of resource being affected (user, gig, payment, etc.)
        resource_id: ID of the resource being affected
        description: Human-readable description of the action
        old_values: Previous values (for updates)
        new_values: New values (for creates/updates)
        request: FastAPI request object for extracting IP and user agent
    """
    try:
        # Extract request information if available
        ip_address = None
        user_agent = None
        
        if request:
            # Get client IP (considering proxy headers)
            ip_address = (
                request.headers.get("x-forwarded-for", "").split(",")[0].strip() or
                request.headers.get("x-real-ip") or
                request.client.host if request.client else None
            )
            user_agent = request.headers.get("user-agent")
        
        # Create audit log entry
        audit_log = AuditLog(
            admin_user_id=admin_user.id,
            action=action.upper(),
            resource_type=resource_type.lower(),
            resource_id=str(resource_id),
            old_values=old_values,
            new_values=new_values,
            description=description,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        db.add(audit_log)
        db.commit()
        
        logger.info(f"Audit log created: {action} {resource_type} {resource_id} by admin {admin_user.id}")
        
    except Exception as e:
        # Don't let audit logging failures break the main operation
        logger.error(f"Failed to create audit log: {e}")
        db.rollback()

def get_resource_values(resource: Any) -> Dict[str, Any]:
    """
    Extract values from a SQLAlchemy model for audit logging.
    
    Args:
        resource: SQLAlchemy model instance
        
    Returns:
        Dictionary of resource values
    """
    if not resource:
        return {}
    
    try:
        # Get all column values
        values = {}
        for column in resource.__table__.columns:
            value = getattr(resource, column.name, None)
            # Convert non-serializable types
            if hasattr(value, 'isoformat'):  # datetime
                values[column.name] = value.isoformat()
            elif isinstance(value, uuid.UUID):
                values[column.name] = str(value)
            else:
                values[column.name] = value
        
        # Remove sensitive information
        sensitive_fields = ['hashed_password', 'password']
        for field in sensitive_fields:
            if field in values:
                values[field] = '[REDACTED]'
        
        return values
    except Exception as e:
        logger.error(f"Failed to extract resource values: {e}")
        return {}

def create_audit_description(action: str, resource_type: str, resource_data: Dict[str, Any]) -> str:
    """
    Create a human-readable description for an audit log entry.
    
    Args:
        action: The action performed
        resource_type: Type of resource
        resource_data: Resource data
        
    Returns:
        Human-readable description
    """
    try:
        if resource_type == 'user':
            name = f"{resource_data.get('first_name', '')} {resource_data.get('last_name', '')}".strip()
            email = resource_data.get('email', '')
            
            if action == 'CREATE':
                return f"Created user {name} ({email})"
            elif action == 'UPDATE':
                return f"Updated user {name} ({email})"
            elif action == 'DELETE':
                return f"Deleted user {name} ({email})"
            elif action == 'SUSPEND':
                return f"Suspended user {name} ({email})"
            elif action == 'ACTIVATE':
                return f"Activated user {name} ({email})"
                
        elif resource_type == 'gig':
            title = resource_data.get('title', 'Untitled')
            
            if action == 'CREATE':
                return f"Created gig '{title}'"
            elif action == 'UPDATE':
                return f"Updated gig '{title}'"
            elif action == 'DELETE':
                return f"Deleted gig '{title}'"
                
        elif resource_type == 'payment':
            amount = resource_data.get('amount', 0)
            
            if action == 'CREATE':
                return f"Created payment of ${amount}"
            elif action == 'UPDATE':
                return f"Updated payment of ${amount}"
            elif action == 'RELEASE':
                return f"Released payment of ${amount}"
        
        # Fallback description
        return f"{action.title()} {resource_type} {resource_data.get('id', '')}"
        
    except Exception as e:
        logger.error(f"Failed to create audit description: {e}")
        return f"{action} {resource_type}"