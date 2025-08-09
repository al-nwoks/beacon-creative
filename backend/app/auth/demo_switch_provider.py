"""
Demo script to show how to switch between authentication providers
"""

import os
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from app.auth.providers.factory import get_provider, get_available_providers
from app.auth.config import get_current_auth_provider


def demo_provider_switching():
    """Demonstrate how to switch between authentication providers"""
    
    print("Authentication Provider Demo")
    print("=" * 40)
    
    # Show current provider
    current_provider = get_current_auth_provider()
    print(f"Current authentication provider: {current_provider}")
    
    # Show available providers
    available_providers = get_available_providers()
    print(f"Available providers: {', '.join(available_providers)}")
    
    # Get the current provider instance
    provider = get_provider(current_provider)
    print(f"Provider class: {provider.__class__.__name__}")
    
    print("\nTo switch providers, set the AUTH_PROVIDER environment variable:")
    print("  export AUTH_PROVIDER=auth0  # To use Auth0")
    print("  export AUTH_PROVIDER=clerk  # To use Clerk")
    print("  export AUTH_PROVIDER=stack  # To use Stack Auth")
    print("  export AUTH_PROVIDER=jwt    # To use JWT (default)")
    
    print("\nYou can also enable/disable providers with environment variables:")
    print("  export AUTH0_ENABLED=true")
    print("  export CLERK_ENABLED=true")
    print("  export STACK_ENABLED=true")


if __name__ == "__main__":
    demo_provider_switching()