# B3ACON Frontend (Next.js 15)

This is the Next.js frontend for B3ACON Creative Connect.

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Comprehensive Documentation](#comprehensive-documentation)
- [Auth and Security Model](#auth-and-security-model)
- [Data Fetching Strategy](#data-fetching-strategy)
- [Component Architecture](#component-architecture)
- [Routing Structure](#routing-structure)
- [Environment Configuration](#environment-configuration)
- [Development Setup](#development-setup)
- [Run with Docker Compose](#run-with-docker-compose)
- [Mock Credentials](#mock-credentials)
- [Deployment](#deployment)
- [Testing](#testing)
- [Notes](#notes)

## Project Overview

B3ACON Creative Connect is a platform that connects creative professionals with clients for project collaboration. The frontend is built with Next.js 15 and provides a comprehensive dashboard experience for both creatives and clients.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with Headless UI integration
- **State Management**: React hooks and SWR for data fetching
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Comprehensive Documentation

For detailed information about the frontend architecture, components, data flow, and development practices, see:
- [Frontend Codebase Documentation](docs/FRONTEND_CODEBASE.md)
- [Profile Components Documentation](docs/PROFILE_COMPONENTS.md)
- [Component Manifest](docs/component-manifest.md)

## Auth and Security Model

### Authentication Flow

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

### Security Features

- Tokens are not stored in localStorage. They reside in HttpOnly cookies.
- Browser only calls same-origin `/api/*` endpoints. The Next server (inside Docker) uses internal DNS `http://backend:8000` to reach FastAPI.
- CSRF protection with double-submit cookie pattern
- Security headers added in [frontend/src/app/middleware.ts](frontend/src/app/middleware.ts:1)

Relevant files:
- Login handler: [frontend/src/app/api/auth/login/route.ts](frontend/src/app/api/auth/login/route.ts:1)
- Register handler: [frontend/src/app/api/auth/register/route.ts](frontend/src/app/api/auth/register/route.ts:1)
- Logout handler: [frontend/src/app/api/auth/logout/route.ts](frontend/src/app/api/auth/logout/route.ts:1)
- Login form: [frontend/src/components/forms/LoginForm.tsx](frontend/src/components/forms/LoginForm.tsx:1) (posts to `/api/auth/login`, redirects on 204)
- Register form: [frontend/src/components/forms/RegisterForm.tsx](frontend/src/components/forms/RegisterForm.tsx:1) (posts to `/api/auth/register`, redirects on 201)

## Data Fetching Strategy

The application uses a hybrid data approach:
1. **Server-side initial fetch** - For SEO/first-paint and to avoid client race conditions with HttpOnly cookies
2. **Client-side SWR** - For live updates, polling, and mutations
3. **Centralized API helpers** - Used by both server and client layers

### API Helpers

Located in `frontend/src/lib/api.ts`:
- `serverFetch(path, init)` - For server components (SSR/server-side)
- `clientFetcher(input, init)` - For SWR and client-side requests
- `buildQuery(params)` - Query string helper
- Feature APIs: `usersAPI`, `projectsAPI`, `authAPI`

## Component Architecture

### Directory Organization

```
components/
├── auth/          # Authentication components
├── dashboard/     # Dashboard-specific components
├── forms/         # Form components
├── headless/      # Headless UI wrappers
├── home/          # Homepage components
├── icons/         # Icon components
├── layout/        # Layout components
├── messaging/     # Messaging components
├── navigation/    # Navigation components
├── profiles/      # Profile components (see PROFILE_COMPONENTS.md for details)
├── project/       # Project components
├── projects/      # Projects components
├── shared/        # Shared components
├── ui/            # UI primitives
└── workspace/     # Workspace components
```

### Component Guidelines

1. **UI Primitives** - Centralized in `components/ui/` (Button, Input, Modal, etc.)
2. **Icons** - Centralized in `components/icons/` with index exports
3. **Layout Components** - In `components/layout/` (Shell, SimplifiedLayout)
4. **Feature Components** - Organized by feature (dashboard, projects, etc.)

## Routing Structure

### Route Groups

The application uses route groups to organize related pages:

#### (auth) Route Group
- **Purpose**: Authentication pages
- **Pages**: `/login`, `/register`
- **Features**: Minimal layout without headers/footers

#### (dashboard) Route Group
- **Purpose**: Role-based dashboards
- **Pages**: `/client`, `/creative`
- **Features**: 
  - Uses SimplifiedLayout for in-app experience
  - Protected by role-specific authentication guards
  - Opt-out of global header/footer chrome

### Public Routes
Public pages (About, Careers, etc.) use the MainLayout component and are rendered with full headers/footers by the global Shell.

### Internal Routes
Internal pages (dashboards, profile, etc.) use the SimplifiedLayout component and hide the global Shell chrome.

## Environment Configuration

- Root `/.env` (git-ignored) is the single source of truth.
  - `NEXT_PUBLIC_API_URL=http://backend:8000` (Compose internal DNS; the client normalizes to include `/api/v1`)
  - `NEXT_PUBLIC_WS_URL=ws://backend:8000/ws`
- Ensure frontend runs in Docker (exposing 3000:3000) so it can reach `backend` internally.

## Development Setup

### Prerequisites
- Node.js >= 22.0.0
- npm >= 10.0.0

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
Open http://localhost:3000

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

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

## Deployment

The application is designed to be deployed with Docker Compose. For production deployment:

1. Set appropriate environment variables
2. Build and deploy the Docker containers
3. Configure reverse proxy (nginx) for production URLs
4. Set up SSL certificates

## Testing

### Unit Testing
- API helpers: Test with mock fetch in `tests/lib/api.test.ts`
- Components: Test with Jest and React Testing Library
- Hooks: Test custom hooks in isolation

### Integration Testing
- Page components: Test server/client data flow
- Authentication flows: Test login/logout scenarios
- Data mutations: Test create/update/delete operations

### Manual Testing
- Page load: Verify initial data on server
- Client revalidation: Verify SWR revalidation
- Mutations: Verify mutations succeed and UI updates
- Unauthorized flows: Verify proper handling of unauthenticated users

## Notes

- Security headers are added in [frontend/src/app/middleware.ts](frontend/src/app/middleware.ts:1).
- Avoid exposing internal Docker hostnames to the browser. Keep all external calls to `/api/*` and proxy server-side.
- The application follows a migration plan to move pages to the hybrid data approach.
