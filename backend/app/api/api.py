from fastapi import APIRouter

from app.api.endpoints import (
    auth,
    users,
    projects,
    applications,
    messages,
    project_file,
    payments
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(project_file, prefix="/files", tags=["files"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
