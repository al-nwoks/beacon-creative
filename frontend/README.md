# B3ACON Frontend (Next.js 15)

This is the Next.js frontend for B3ACON Creative Connect.

## Auth and Security Model

- Server-side route handlers (Next.js App Router):
  - POST `/api/auth/login`:
    - Body: `{ "email": string, "password": string }`
    - Proxies to backend `/api/v1/auth/login` (form urlencoded) and sets `access_token` as HttpOnly; Secure; SameSite=Lax cookie on success.
    - Returns `204` on success.
  - POST `/api/auth/register`:
    - Body (JSON backend schema):
      ```
      {
        "email": "...",
        "password": "...",
        "confirm_password": "...",
        "first_name": "...",
        "last_name": "...",
        "role": "creative" | "client" | "admin",
        "bio": "...?",
        "location": "...?",
        "profile_image_url": "...?"
      }
      ```
    - Proxies to `/api/v1/auth/register`, then auto-logs-in and sets the `access_token` cookie. Returns `201` on success.
  - POST `/api/auth/logout`:
    - Clears `access_token` and `csrf_token` cookies. Returns `204`.

- Tokens are not stored in localStorage. They reside in HttpOnly cookies.
- Browser only calls same-origin `/api/*` endpoints. The Next server (inside Docker) uses internal DNS `http://backend:8000` to reach FastAPI.

Relevant files:
- Login handler: [frontend/src/app/api/auth/login/route.ts](frontend/src/app/api/auth/login/route.ts:1)
- Register handler: [frontend/src/app/api/auth/register/route.ts](frontend/src/app/api/auth/register/route.ts:1)
- Logout handler: [frontend/src/app/api/auth/logout/route.ts](frontend/src/app/api/auth/logout/route.ts:1)
- Login form: [frontend/src/components/forms/LoginForm.tsx](frontend/src/components/forms/LoginForm.tsx:1) (posts to `/api/auth/login`, redirects on 204)
- Register form: [frontend/src/components/forms/RegisterForm.tsx](frontend/src/components/forms/RegisterForm.tsx:1) (posts to `/api/auth/register`, redirects on 201)

## Environment

- Root `/.env` (git-ignored) is the single source of truth.
  - `NEXT_PUBLIC_API_URL=http://backend:8000` (Compose internal DNS; the client normalizes to include `/api/v1`)
  - `NEXT_PUBLIC_WS_URL=ws://backend:8000/ws`
- Ensure frontend runs in Docker (exposing 3000:3000) so it can reach `backend` internally.

## Run with Docker Compose

1. Create `/.env`:
   ```
   NEXT_PUBLIC_API_URL=http://backend:8000
   NEXT_PUBLIC_WS_URL=ws://backend:8000/ws
   MOCK_MODE=True
   SEED_DATA=True
   ```
2. Build and start:
   ```
   docker-compose build --no-cache
   docker-compose up
   ```
3. Open http://localhost:3000

## Mock Credentials

When the backend runs with `MOCK_MODE=True` (and/or `SEED_DATA=True`), mock users are seeded. Use the credentials listed in the backend README (admin, client, creative) to sign in quickly.

## Notes

- Security headers are added in [frontend/src/app/middleware.ts](frontend/src/app/middleware.ts:1).
- Avoid exposing internal Docker hostnames to the browser. Keep all external calls to `/api/*` and proxy server-side.
