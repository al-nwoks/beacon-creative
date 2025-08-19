import logging
from typing import Dict, Type, Optional
import importlib

from app.auth.providers.base import AuthProvider
from app.auth.providers.jwt_provider import JWTAuthProvider
from app.auth.config import get_auth_provider_config, is_auth_provider_enabled

logger = logging.getLogger(__name__)

# Registry of available authentication providers
_PROVIDER_REGISTRY: Dict[str, Type[AuthProvider]] = {
    "jwt": JWTAuthProvider,
}

# Cache for instantiated providers
_provider_instances: Dict[str, AuthProvider] = {}


def _import_provider_class(class_path: str) -> Optional[Type[AuthProvider]]:
    """Dynamically import an authentication provider class"""
    try:
        module_path, class_name = class_path.rsplit(".", 1)
        module = importlib.import_module(module_path)
        provider_class = getattr(module, class_name)
        return provider_class
    except (ImportError, AttributeError) as e:
        logger.error(f"Failed to import provider class {class_path}: {e}")
        return None


def register_provider(name: str, provider_class: Type[AuthProvider]) -> None:
    """Register a new authentication provider"""
    _PROVIDER_REGISTRY[name] = provider_class
    # Clear cache for this provider if it exists
    if name in _provider_instances:
        del _provider_instances[name]
    logger.info(f"Registered authentication provider: {name}")


def load_providers_from_config() -> None:
    """Load authentication providers based on configuration"""
    for provider_name in ["auth0", "clerk", "stack"]:
        if is_auth_provider_enabled(provider_name):
            config = get_auth_provider_config(provider_name)
            if config and "class" in config:
                provider_class = _import_provider_class(config["class"])
                if provider_class:
                    register_provider(provider_name, provider_class)
                    logger.info(f"Loaded authentication provider from config: {provider_name}")


def get_provider(name: str) -> AuthProvider:
    """Get an authentication provider instance by name"""
    # Load providers from config if not already loaded
    if not _provider_instances:
        load_providers_from_config()
    
    if name not in _PROVIDER_REGISTRY:
        raise ValueError(f"Unknown authentication provider: {name}")
    
    # Return cached instance if available
    if name in _provider_instances:
        return _provider_instances[name]
    
    # Create new instance
    provider_class = _PROVIDER_REGISTRY[name]
    provider_instance = provider_class()
    _provider_instances[name] = provider_instance
    
    logger.debug(f"Created authentication provider instance: {name}")
    return provider_instance


def get_available_providers() -> list[str]:
    """Get list of available authentication provider names"""
    # Load providers from config to ensure we have the complete list
    load_providers_from_config()
    return list(_PROVIDER_REGISTRY.keys())