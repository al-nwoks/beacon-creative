# Authentication System

This project implements a flexible authentication system that supports multiple authentication providers. The system is designed to be easily extensible to support additional providers like Auth0, Clerk, Stack Auth, etc.

## Architecture

The authentication system follows a provider-based architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────────┐
│   Middleware    │────│  Auth Provider   │────│  User Management   │
│                 │    │                  │    │                    │
│ get_current_user├────┤ authenticate()   ├───▶│  Database Access   │
│                 │    │ get_user_by_token│    │                    │
└─────────────────┘    │ create_token()   │    └────────────────────┘
                       │ validate_token() │
                       └──────────────────┘
```

## Providers

### JWT Provider (Default)
The JWT provider is the default authentication provider that uses JSON Web Tokens for authentication. It's a self-contained provider that doesn't require external services.

### Auth0 Provider
Template implementation for Auth0 integration. To use Auth0:

1. Set environment variables:
   ```bash
   AUTH_PROVIDER=auth0
   AUTH0_ENABLED=true
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_AUDIENCE=your-api-identifier
   ```

2. Implement the Auth0AuthProvider methods in `providers/auth0_provider.py`

### Clerk Provider
Template implementation for Clerk integration. To use Clerk:

1. Set environment variables:
   ```bash
   AUTH_PROVIDER=clerk
   CLERK_ENABLED=true
   CLERK_SECRET_KEY=your-clerk-secret-key
   CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   ```

2. Implement the ClerkAuthProvider methods in `providers/clerk_provider.py`

### Stack Auth Provider
Template implementation for Stack Auth integration. To use Stack Auth:

1. Set environment variables:
   ```bash
   AUTH_PROVIDER=stack
   STACK_ENABLED=true
   STACK_PROJECT_ID=your-stack-project-id
   STACK_SECRET_KEY=your-stack-secret-key
   ```

2. Implement the StackAuthProvider methods in `providers/stack_provider.py`

## Configuration

The authentication system can be configured using environment variables:

- `AUTH_PROVIDER`: The authentication provider to use (default: "jwt")
- Provider-specific variables as shown above

## Usage

### Backend

To protect an API endpoint, use the authentication dependencies:

```python
from app.auth.dependencies import get_current_active_user_dependency
from app.models.user import User

@router.get("/protected")
def protected_route(
    current_user: User = Depends(get_current_active_user_dependency)
):
    return {"message": f"Hello {current_user.email}"}
```

### Frontend

To protect a page, wrap it with the ProtectedRoute component:

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function MyProtectedPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <div>Protected content</div>
    </ProtectedRoute>
  )
}
```

## Extending the System

To add a new authentication provider:

1. Create a new provider class that extends `AuthProvider` in `providers/`
2. Implement all required methods
3. Register the provider in `providers/factory.py`
4. Add configuration to `config.py`
5. Set the appropriate environment variables

## Testing

To test with different providers, simply change the `AUTH_PROVIDER` environment variable and restart the application.