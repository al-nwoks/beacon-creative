"""
PostHog client for server-side analytics tracking.
"""

import logging
import os
from typing import Dict, Any, Optional
from posthog import Posthog

logger = logging.getLogger(__name__)

# Global PostHog client instance
_posthog_client: Optional[Posthog] = None

def getPostHogClient() -> Optional[Posthog]:
    """
    Get or create the PostHog client instance.
    
    Returns:
        PostHog client instance or None if not configured
    """
    global _posthog_client
    
    # Return existing client if already initialized
    if _posthog_client is not None:
        return _posthog_client
    
    # Get configuration from environment variables
    posthog_key = os.getenv('NEXT_PUBLIC_POSTHOG_KEY')
    posthog_host = os.getenv('NEXT_PUBLIC_POSTHOG_HOST', 'https://us.i.posthog.com')
    
    if not posthog_key:
        logger.warning('[PostHog Backend] PostHog key not found in environment variables. Analytics disabled.')
        return None
    
    try:
        _posthog_client = Posthog(
            project_api_key=posthog_key,
            host=posthog_host,
            debug=os.getenv('NODE_ENV') == 'development',
            on_error=lambda error, batch: logger.error(f'[PostHog Backend] Error: {error}')
        )
        logger.info('[PostHog Backend] Successfully initialized PostHog client')
        return _posthog_client
    except Exception as e:
        logger.error(f'[PostHog Backend] Failed to initialize PostHog client: {e}')
        return None

def trackServerEvent(
    distinctId: str,
    event: str,
    properties: Optional[Dict[str, Any]] = None
) -> None:
    """
    Track an event using the PostHog client.
    
    Args:
        distinctId: Unique identifier for the user
        event: Event name
        properties: Additional event properties
    """
    client = getPostHogClient()
    if not client:
        return
    
    try:
        client.capture(
            distinct_id=distinctId,
            event=event,
            properties={
                **(properties or {}),
                '$lib': 'posthog-python',
                '$lib_version': '3.0.0',
                'server_side': True,
            }
        )
        logger.debug(f'[PostHog Backend] Tracked event: {event} for user: {distinctId}')
    except Exception as e:
        logger.error(f'[PostHog Backend] Failed to track event {event}: {e}')

def identifyUser(
    distinctId: str,
    properties: Optional[Dict[str, Any]] = None
) -> None:
    """
    Identify a user with additional properties.
    
    Args:
        distinctId: Unique identifier for the user
        properties: User properties
    """
    client = getPostHogClient()
    if not client:
        return
    
    try:
        client.identify(
            distinct_id=distinctId,
            properties=properties or {}
        )
        logger.debug(f'[PostHog Backend] Identified user: {distinctId}')
    except Exception as e:
        logger.error(f'[PostHog Backend] Failed to identify user {distinctId}: {e}')

def shutdownPostHog() -> None:
    """
    Shutdown the PostHog client and flush any pending events.
    """
    global _posthog_client
    
    if _posthog_client:
        try:
            _posthog_client.shutdown()
            logger.info('[PostHog Backend] PostHog client shutdown successfully')
        except Exception as e:
            logger.error(f'[PostHog Backend] Error during shutdown: {e}')
        finally:
            _posthog_client = None

# Ensure proper cleanup on application shutdown
import atexit
atexit.register(shutdownPostHog)