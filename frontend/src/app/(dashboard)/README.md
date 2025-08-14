# Dashboard Route Group

This route group contains role-based dashboards for different user types:

## Structure

- `/client` - Client dashboard
- `/creative` - Creative dashboard

## Purpose

The (dashboard) route group is used to organize role-based dashboards with shared layouts and authentication guards. Each dashboard is protected by a role-specific guard and uses the SimplifiedLayout component.

## Authentication

Each dashboard page uses the ProtectedRoute component with a requiredRole prop:
- Client dashboard: `requiredRole="client"`
- Creative dashboard: `requiredRole="creative"`

## Layout

The group layout (`layout.tsx`) opts out of the global PublicHeader/PublicFooter chrome to provide a clean in-app experience.