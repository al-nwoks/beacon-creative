"""
Analytics utilities for server-side event tracking with PostHog.
"""

import logging
from typing import Dict, Any, Optional
from app.lib.posthog import getPostHogClient, trackServerEvent

logger = logging.getLogger(__name__)

def track_event(
    user_id: str,
    event: str,
    properties: Optional[Dict[str, Any]] = None
) -> None:
    """
    Track an event for analytics.
    
    Args:
        user_id: The user ID to associate with the event
        event: The event name
        properties: Additional properties to include with the event
    """
    try:
        # Use the PostHog client to track the event
        trackServerEvent(
            distinctId=user_id,
            event=event,
            properties=properties or {}
        )
        logger.debug(f"Tracked event '{event}' for user {user_id}")
    except Exception as e:
        # Don't let analytics failures break the application
        logger.warning(f"Failed to track event '{event}' for user {user_id}: {e}")

def track_messaging_event(
    user_id: str,
    event_type: str,
    message_data: Dict[str, Any]
) -> None:
    """
    Track messaging-specific events.
    
    Args:
        user_id: The user ID
        event_type: Type of messaging event (sent, received, deleted, etc.)
        message_data: Message-related data
    """
    event_name = f"message_{event_type}"
    track_event(user_id, event_name, message_data)

def track_user_action(
    user_id: str,
    action: str,
    context: Optional[Dict[str, Any]] = None
) -> None:
    """
    Track general user actions.
    
    Args:
        user_id: The user ID
        action: The action performed
        context: Additional context about the action
    """
    track_event(
        user_id=user_id,
        event="user_action",
        properties={
            "action": action,
            "context": context or {}
        }
    )

def track_error(
    user_id: Optional[str],
    error_type: str,
    error_message: str,
    context: Optional[Dict[str, Any]] = None
) -> None:
    """
    Track errors for monitoring and debugging.
    
    Args:
        user_id: The user ID (if available)
        error_type: Type of error
        error_message: Error message
        context: Additional context about the error
    """
    track_event(
        user_id=user_id or "anonymous",
        event="error_occurred",
        properties={
            "error_type": error_type,
            "error_message": error_message,
            "context": context or {}
        }
    )