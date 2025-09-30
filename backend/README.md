# B3ACON Backend (FastAPI)

FastAPI service that powers B3ACON Creative Connect. It exposes a versioned API mounted at `/api/v1`.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Key Endpoints](#key-endpoints)
- [Project Structure](#project-structure)
- [App Mounting and CORS](#app-mounting-and-cors)
- [Authentication System](#authentication-system)
- [Database Schema](#database-schema)
- [Mock Data and Seeding](#mock-data-and-seeding)
- [Environment Variables](#environment-variables)
- [Run with Docker Compose](#run-with-docker-compose)
- [Development (Local)](#development-local)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Monitoring and Logging](#monitoring-and-logging)
- [Security](#security)

## Overview

The B3ACON backend is a FastAPI application that provides RESTful APIs for the creative marketplace platform. It handles user management, gig listings, applications, messaging, payments, and notifications.

## Key Features

### Core Functionality
- **User Management**: Registration, authentication, profile management
- **Gig Management**: Create, browse, and manage creative gigs
- **Application System**: Apply to gigs and manage applications
- **Messaging**: Real-time communication between users
- **File Management**: Upload and manage gig files
- **Payment Processing**: Secure payment handling with escrow
- **Notifications**: Real-time user notifications

### Technical Features
- **RESTful API**: Clean, consistent API design
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Creative, client, and admin roles
- **Database ORM**: SQLAlchemy for database interactions
- **Data Validation**: Pydantic models for request/response validation
- **Database Migrations**: Alembic for schema management
- **CORS Support**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting (planned)
- **Caching**: Redis integration for caching (planned)

## Technology Stack

- **Framework**: FastAPI 0.100+
- **Language**: Python 3.11+
- **Database**: PostgreSQL 15+ with SQLAlchemy 2.0+
- **Authentication**: JWT with flexible provider system
- **Validation**: Pydantic v2+
- **Database Migrations**: Alembic
- **Caching**: Redis 7+ (planned)
- **Task Queue**: Celery with Redis (planned)
- **Testing**: Pytest
- **Documentation**: Auto-generated Swagger and ReDoc

## Key Endpoints

### Authentication
- POST /api/v1/auth/register
  - Body (JSON):
    ```json
    {
      "email": "user@example.com",
      "password": "string",
      "confirm_password": "string",
      "first_name": "string",
      "last_name": "string",
      "role": "creative" | "client" | "admin",
      "bio": "string?",
      "location": "string?",
      "profile_image_url": "string?"
    }
    ```
  - Validations:
    - email unique
    - password === confirm_password
    - role ∈ {creative, client, admin}
  - Response: User (without password hash)

- POST /api/v1/auth/login
  - Body (x-www-form-urlencoded, OAuth2PasswordRequestForm):
    - username: email
    - password: password
  - Response:
    ```json
    {
      "access_token": "jwt",
      "token_type": "bearer"
    }
    ```

- POST /api/v1/auth/logout
  - Clears authentication session
  - Response: Success message

### Users
- GET /api/v1/users/me (Authorization: Bearer <token>)
- PUT /api/v1/users/me
- POST /api/v1/users/upload-avatar

### Gigs
- GET /api/v1/gigs
- POST /api/v1/gigs
- GET /api/v1/gigs/{id}
- PUT /api/v1/gigs/{id}
- DELETE /api/v1/gigs/{id}
- GET /api/v1/gigs/my-gigs

### Applications
- GET /api/v1/applications
- POST /api/v1/applications
- GET /api/v1/applications/{id}
- PUT /api/v1/applications/{id}
- DELETE /api/v1/applications/{id}
- GET /api/v1/applications/me

### Messages
- GET /api/v1/messages
- POST /api/v1/messages
- GET /api/v1/messages/{id}
- PUT /api/v1/messages/{id}
- DELETE /api/v1/messages/{id}
- GET /api/v1/messages/conversations

### Files
- GET /api/v1/files
- POST /api/v1/files
- GET /api/v1/files/{id}
- DELETE /api/v1/files/{id}

### Payments
- GET /api/v1/payments
- POST /api/v1/payments
- GET /api/v1/payments/{id}
- PUT /api/v1/payments/{id}/release
- GET /api/v1/payments/me

### Notifications
- GET /api/v1/notifications
- POST /api/v1/notifications
- GET /api/v1/notifications/{id}
- PUT /api/v1/notifications/{id}/read
- PUT /api/v1/notifications/read-all

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # Application entry point
│   ├── api/                    # API router configuration
│   │   ├── api.py              # Main API router
│   │   └── endpoints/          # API endpoint handlers
│   ├── auth/                   # Authentication system
│   │   ├── providers/          # Auth provider implementations
│   │   ├── dependencies.py     # Auth dependencies
│   │   ├── jwt.py              # JWT utilities
│   │   ├── password.py         # Password utilities
│   │   └── README.md           # Auth documentation
│   ├── core/                   # Core application components
│   │   └── config.py           # Application configuration
│   ├── db/                     # Database components
│   │   ├── database.py         # Database connection
│   │   └── seed_data.py        # Data seeding
│   ├── middleware/             # Custom middleware
│   ├── models/                 # Database models
│   ├── schemas/                # Pydantic schemas
│   └── utils/                  # Utility functions
├── alembic/                    # Database migrations
├── uploads/                    # File uploads (development)
├── tests/                      # Test suite
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker configuration
└── alembic.ini                 # Alembic configuration
```

## App Mounting and CORS

### API Mounting
- The API router is mounted at `/api/v1` in [app/main.py](app/main.py).
- CORS is configured from `settings.BACKEND_CORS_ORIGINS` in [app/core/config.py](app/core/config.py).

### CORS Configuration
```python
# Allow specific origins
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://frontend:3000"]
```

## Authentication System

### Provider Architecture
Auth is abstracted with a provider factory in [app/auth/providers/factory.py](app/auth/providers/factory.py). The default provider is JWT (`jwt`), which:
- Authenticates user credentials
- Issues JWT access tokens
- Validates tokens

### Available Providers
1. **JWT Provider** (default): Built-in JWT authentication
2. **Auth0 Provider**: Template for Auth0 integration
3. **Clerk Provider**: Template for Clerk integration
4. **Stack Auth Provider**: Template for Stack Auth integration

### Provider Selection
Provider selection is controlled by `get_current_auth_provider()`.

### JWT Configuration
```python
# Environment variables for JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

## Database Schema

### Core Tables
1. **Users**: User accounts and profiles
2. **Gigs**: Gig listings and details
3. **Applications**: Gig applications
4. **Messages**: User messaging system
5. **Gig Files**: File attachments
6. **Payments**: Payment transactions
7. **Notifications**: User notifications

### Database Configuration
```python
# PostgreSQL connection
DATABASE_URL=postgresql://postgres:postgres@db:5432/beacon
```

### Migration Commands
```bash
# Generate migration
alembic revision --autogenerate -m "Migration description"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Mock Data and Seeding

### Seeding Options
When running with mock or seed flags, the app seeds the database on startup.

#### MOCK_MODE=True
- Clears tables and seeds a full set of users, gigs, applications, etc.
- See [app/db/seed_data.py](app/db/seed_data.py)

#### SEED_DATA=True
- Seeds only an admin user

#### SEED_ADMIN=True
- Seeds admin user regardless of other seeding options

### Mock Users
Creatives:
- sarah.johnson@example.com / password123
- mike.chen@example.com / password123
- emma.davis@example.com / password123
- alex.rodriguez@example.com / password123
- lisa.wang@example.com / password123

Clients:
- john.smith@stylemagzine.com / password123
- maria.gonzalez@beachvibes.com / password123
- david.kim@runwayproductions.com / password123
- jennifer.brown@techstartup.com / password123

Admin (when only seeding admin or when MOCK_MODE resets tables and re-seeds):
- admin@beacon-connect.com / admin123

See [app/db/seed_data.py](app/db/seed_data.py) for details.

## Environment Variables

Defined in [app/core/config.py](app/core/config.py). Typical configuration via root `/.env`:

### Core Settings
```bash
# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=B3ACON Creative Connect
PROJECT_VERSION=0.1.0

# CORS Settings
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://frontend:3000"]

# Database Settings
DATABASE_URL=postgresql://postgres:postgres@db:5432/beacon

# JWT Settings
SECRET_KEY=your-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# File Storage
UPLOAD_DIRECTORY=uploads
MAX_FILE_SIZE=52428800

# Seeding
MOCK_MODE=True|False
SEED_DATA=True|False
SEED_ADMIN=True|False

# Logging
LOG_LEVEL=DEBUG|INFO

# Authentication Provider
AUTH_PROVIDER=jwt|auth0|clerk|stack
```

### Third-Party Services
```bash
# Stripe Settings
STRIPE_API_KEY=your-stripe-api-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email Settings
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@beacon-connect.com
EMAIL_FROM_NAME=B3ACON Creative Connect

# Auth0 Settings
AUTH0_ENABLED=true|false
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-api-identifier

# Clerk Settings
CLERK_ENABLED=true|false
CLERK_SECRET_KEY=your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

# Stack Auth Settings
STACK_ENABLED=true|false
STACK_PROJECT_ID=your-stack-project-id
STACK_SECRET_KEY=your-stack-secret-key
```

## Run with Docker Compose

### Setup Instructions
From the repository root:
1. Set `/.env` with your values (mock users: `MOCK_MODE=True`).
2. `docker-compose build --no-cache`
3. `docker-compose up`

### Health Check
- GET http://backend:8000/api/v1/health (inside Docker network)
- GET http://localhost:8000/api/v1/health (only if you explicitly publish the backend port)

## Development (Local)

### Local Setup
If running outside Docker:
1. Install Python 3.11+
2. Install dependencies: `pip install -r requirements.txt`
3. Set up PostgreSQL database
4. Configure environment variables

### Start the API
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Development Commands
```bash
# Run tests
pytest

# Run linter
flake8 .

# Run type checker
mypy .

# Generate migrations
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## API Documentation

### Auto-generated Documentation
- **OpenAPI Specification**: /api/v1/openapi.json
- **Swagger UI**: /api/v1/docs
- **ReDoc**: /api/v1/redoc

### Documentation Features
- Interactive API testing
- Schema validation
- Example requests and responses
- Authentication support

## Testing

### Test Suite
The backend includes a comprehensive test suite using pytest.

### Test Categories
1. **Unit Tests**: Individual function and class testing
2. **Integration Tests**: API endpoint testing
3. **Database Tests**: Database operation testing
4. **Authentication Tests**: Auth provider testing

### Running Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_users.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test
pytest -k "test_user_registration"
```

### Test Configuration
```python
# conftest.py for test fixtures
@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def db():
    # Database fixture for tests
    pass
```

## Deployment

### Production Deployment
1. **Containerization**: Use provided Dockerfile
2. **Environment**: Set production environment variables
3. **Database**: Use production database connection
4. **Security**: Enable HTTPS and secure headers
5. **Monitoring**: Set up logging and monitoring

### Scaling Considerations
1. **Horizontal Scaling**: Multiple backend instances
2. **Load Balancing**: Reverse proxy for load distribution
3. **Database Connection Pooling**: Optimize database connections
4. **Caching**: Implement Redis caching for performance
5. **Task Queues**: Offload heavy operations to background workers

### Deployment Platforms
1. **Docker Swarm**: Container orchestration
2. **Kubernetes**: Advanced container orchestration
3. **Cloud Platforms**: AWS, GCP, Azure deployment
4. **Heroku**: Platform-as-a-Service deployment

## Monitoring and Logging

### Logging Configuration
```python
# Custom logging format with request ID
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s - %(name)s - %(levelname)s - [%(request_id)s] - %(message)s",
)
```

### Log Levels
- **DEBUG**: Detailed information for debugging
- **INFO**: General information about application flow
- **WARNING**: Warning conditions
- **ERROR**: Error conditions
- **CRITICAL**: Critical conditions

### Monitoring Features
1. **Request Tracking**: Unique request IDs for tracing
2. **Performance Metrics**: Response time monitoring
3. **Error Tracking**: Exception logging and reporting
4. **Health Checks**: Application health monitoring
5. **Resource Usage**: Memory and CPU monitoring

## Security

### Security Features
1. **Authentication**: JWT-based secure authentication
2. **Authorization**: Role-based access control
3. **Input Validation**: Pydantic validation for all inputs
4. **Password Security**: BCrypt hashing for passwords
5. **CORS Protection**: Controlled cross-origin requests
6. **Rate Limiting**: Request rate limiting (planned)
7. **SQL Injection Prevention**: SQLAlchemy ORM protection
8. **XSS Prevention**: Input sanitization

### Security Best Practices
1. **Secrets Management**: Environment variables for secrets
2. **HTTPS Enforcement**: TLS encryption for all traffic
3. **Security Headers**: HTTP security headers
4. **Regular Updates**: Dependency security updates
5. **Vulnerability Scanning**: Regular security scanning
6. **Penetration Testing**: Periodic security assessments
7. **Incident Response**: Security incident handling procedures

### Compliance
1. **GDPR**: Data protection compliance
2. **CCPA**: California consumer privacy compliance
3. **PCI DSS**: Payment card industry compliance (for payments)
4. **SOC 2**: Security and compliance framework

---

*For detailed documentation on specific components, see:*
- [Authentication System Documentation](app/auth/README.md)
- [API Endpoints Documentation](../frontend/docs/API_ENDPOINTS.md)
- [Database Schema Documentation](../frontend/docs/DATABASE_SCHEMA.md)
- [Environment Variables Documentation](../frontend/docs/ENVIRONMENT_VARIABLES.md)