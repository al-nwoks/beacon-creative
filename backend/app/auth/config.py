import os
from typing import Dict, Any, Optional

# Default authentication provider
DEFAULT_AUTH_PROVIDER = os.getenv("AUTH_PROVIDER", "jwt")

# Configuration for different authentication providers
AUTH_PROVIDER_CONFIG: Dict[str, Dict[str, Any]] = {
    "jwt": {
        "class": "app.auth.providers.jwt_provider.JWTAuthProvider",
        "enabled": True,
        "config": {
            # JWT specific configuration would go here
        }
    },
    "auth0": {
        "class": "app.auth.providers.auth0_provider.Auth0AuthProvider",
        "enabled": os.getenv("AUTH0_ENABLED", "false").lower() == "true",
        "config": {
            "domain": os.getenv("AUTH0_DOMAIN", ""),
            "client_id": os.getenv("AUTH0_CLIENT_ID", ""),
            "client_secret": os.getenv("AUTH0_CLIENT_SECRET", ""),
            "audience": os.getenv("AUTH0_AUDIENCE", ""),
        }
    },
    "clerk": {
        "class": "app.auth.providers.clerk_provider.ClerkAuthProvider",
        "enabled": os.getenv("CLERK_ENABLED", "false").lower() == "true",
        "config": {
            "secret_key": os.getenv("CLERK_SECRET_KEY", ""),
            "publishable_key": os.getenv("CLERK_PUBLISHABLE_KEY", ""),
        }
    },
    "stack": {
        "class": "app.auth.providers.stack_provider.StackAuthProvider",
        "enabled": os.getenv("STACK_ENABLED", "false").lower() == "true",
        "config": {
            "project_id": os.getenv("STACK_PROJECT_ID", ""),
            "secret_key": os.getenv("STACK_SECRET_KEY", ""),
        }
    }
}


def get_auth_provider_config(provider_name: str) -> Optional[Dict[str, Any]]:
    """Get configuration for a specific authentication provider"""
    return AUTH_PROVIDER_CONFIG.get(provider_name)


def is_auth_provider_enabled(provider_name: str) -> bool:
    """Check if an authentication provider is enabled"""
    config = get_auth_provider_config(provider_name)
    return config is not None and config.get("enabled", False)


def get_current_auth_provider() -> str:
    """Get the currently configured authentication provider"""
    provider = os.getenv("AUTH_PROVIDER", DEFAULT_AUTH_PROVIDER)
    if not is_auth_provider_enabled(provider):
        # Fallback to JWT if configured provider is not enabled
        return "jwt"
    return provider