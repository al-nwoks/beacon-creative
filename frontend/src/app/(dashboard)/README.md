# Dashboard Route Group

This route group contains role-based dashboards for different user types:

## Structure

- `/client` - Client dashboard
- `/creative` - Creative dashboard
- `/admin` - Admin dashboard

## Purpose

The (dashboard) route group is used to organize role-based dashboards with shared layouts and authentication guards. Each dashboard is protected by a role-specific guard and uses the SimplifiedLayout component.

## Authentication

Each dashboard page uses the ProtectedRoute component with a requiredRole prop:
- Client dashboard: `requiredRole="client"`
- Creative dashboard: `requiredRole="creative"`
- Admin dashboard: `requiredRole="admin"`

## Layout

The group layout (`layout.tsx`) opts out of the global PublicHeader/PublicFooter chrome to provide a clean in-app experience.

## Dashboard Components

Each dashboard uses the DashboardHeader component which includes:
- Logo linking to the appropriate dashboard based on user role
- Search functionality
- Messages dropdown with recent conversations
- Notifications dropdown with recent alerts
- Profile dropdown with settings and logout options