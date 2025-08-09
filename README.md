# B3ACON Creative Connect

A platform connecting creative professionals with clients for project collaboration.

## Features

- User authentication and authorization
- Project management
- Talent marketplace
- Messaging system
- Payment processing

## Authentication System

This project implements a flexible authentication system that supports multiple authentication providers including JWT (default), Auth0, Clerk, and Stack Auth.

### Supported Providers

1. **JWT (Default)**: Built-in JWT authentication
2. **Auth0**: Template implementation ready for Auth0 integration
3. **Clerk**: Template implementation ready for Clerk integration
4. **Stack Auth**: Template implementation ready for Stack Auth integration

### Configuration

To switch between authentication providers, set the `AUTH_PROVIDER` environment variable:

```bash
# Use JWT (default)
export AUTH_PROVIDER=jwt

# Use Auth0
export AUTH_PROVIDER=auth0
export AUTH0_ENABLED=true
export AUTH0_DOMAIN=your-domain.auth0.com
export AUTH0_CLIENT_ID=your-client-id

# Use Clerk
export AUTH_PROVIDER=clerk
export CLERK_ENABLED=true
export CLERK_SECRET_KEY=your-clerk-secret-key

# Use Stack Auth
export AUTH_PROVIDER=stack
export STACK_ENABLED=true
export STACK_PROJECT_ID=your-stack-project-id
```

### Extending the System

The authentication system is designed to be easily extensible. To add a new provider:

1. Create a new provider class that extends `AuthProvider`
2. Implement all required methods
3. Register the provider in the factory
4. Add configuration to `auth/config.py`

See `backend/app/auth/README.md` for detailed documentation.

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── auth/         # Authentication system
│   │   ├── core/         # Core configuration
│   │   ├── db/           # Database models and connections
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── utils/        # Utility functions
│   ├── alembic/          # Database migrations
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js app router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Library functions
│   │   └── styles/       # CSS styles
│   └── package.json      # Node.js dependencies
├── docker-compose.yml    # Docker configuration
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL
- Docker (optional)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run database migrations:
   ```bash
   ./migrate.sh
   ```

6. Start the development server:
   ```bash
   ./start-dev.sh
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.development .env.local
   # Edit .env.local with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Docker Setup

To run the application with Docker:

```bash
docker-compose up --build
```

## Testing

### Backend Tests

```bash
cd backend
python -m pytest
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
