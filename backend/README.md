# B3ACON Backend (FastAPI)

FastAPI service that powers B3ACON Creative Connect. It exposes a versioned API mounted at `/api/v1`.

## Key Endpoints

Auth
- POST /api/v1/auth/register
  - Body (JSON):
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
    {
      "access_token": "jwt",
      "token_type": "bearer"
    }

Users
- GET /api/v1/users/me (Authorization: Bearer <token>)
- PUT /api/v1/users/me

Projects, Applications, Messages, Files, Payments
- See the corresponding routers under `app/api/endpoints/`

## App Mounting and CORS

- The API router is mounted at `/api/v1` in [app/main.py](app/main.py).
- CORS is configured from `settings.BACKEND_CORS_ORIGINS` in [app/core/config.py](app/core/config.py).

## Auth Providers

Auth is abstracted with a provider factory in [app/auth/providers/factory.py](app/auth/providers/factory.py). The default provider is JWT (`jwt`), which:
- Authenticates user credentials
- Issues JWT access tokens
- Validates tokens

Provider selection is controlled by `get_current_auth_provider()`.

## Mock Data and Seeding

When running with mock or seed flags, the app seeds the database on startup.

- MOCK_MODE=True
  - Clears tables and seeds a full set of users, projects, applications, etc.
  - See [app/db/seed_data.py](app/db/seed_data.py)

- SEED_DATA=True
  - Seeds only an admin user

Mock users created by `seed_mock_data` (all with password `password123`):
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
- API_V1_STR=/api/v1
- BACKEND_CORS_ORIGINS=["http://localhost:3000","http://frontend:3000"]
- DATABASE_URL=postgresql://postgres:postgres@db:5432/beacon
- SECRET_KEY=your-secret
- ALGORITHM=HS256
- ACCESS_TOKEN_EXPIRE_MINUTES=1440
- MOCK_MODE=True|False
- SEED_DATA=True|False
- LOG_LEVEL=DEBUG|INFO

## Run (Docker Compose)

From the repository root:
- Set `/.env` with your values (mock users: `MOCK_MODE=True`).
- `docker-compose build --no-cache`
- `docker-compose up`

Health check:
- GET http://backend:8000/api/v1/health (inside Docker network)
- GET http://localhost:8000/api/v1/health (only if you explicitly publish the backend port)

## Development (Local)

If running outside Docker:
- Start the API:
  uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
- Default docs:
  - OpenAPI: /api/v1/openapi.json
  - Swagger: /api/v1/docs
  - Redoc: /api/v1/redoc