from fastapi import APIRouter

from app.api.endpoints import (
    users,
    auth,
    gigs,
    applications,
    messages,
    payments,
    gig_file,
    notifications,
    notification_settings,
    admin,
    dashboard
)
from app.websocket import websocket_router

api_router = APIRouter()
api_router.include_router(users, prefix="/users", tags=["users"])
api_router.include_router(auth, prefix="/auth", tags=["auth"])
api_router.include_router(gigs, prefix="/gigs", tags=["gigs"])
api_router.include_router(applications, prefix="/applications", tags=["applications"])
api_router.include_router(messages, prefix="/messages", tags=["messages"])
api_router.include_router(payments, prefix="/payments", tags=["payments"])
api_router.include_router(gig_file, prefix="/files", tags=["files"])
api_router.include_router(notifications, prefix="/notifications", tags=["notifications"])
api_router.include_router(notification_settings, prefix="/notification-settings", tags=["notification-settings"])
api_router.include_router(dashboard, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(websocket_router, prefix="/ws", tags=["websocket"])

# Admin routes
api_router.include_router(admin, prefix="/admin", tags=["admin"])
