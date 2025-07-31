import logging
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import api_router
from app.db.database import SessionLocal
from app.db.seed_data import seed_mock_data, seed_admin_user

# Set up logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to B3ACON Creative Connect API"}

@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup"""
    logger.info(f"MOCK_MODE: {settings.MOCK_MODE}")
    logger.info(f"SEED_DATA: {settings.SEED_DATA}")
    if settings.MOCK_MODE:
        logger.info("Seeding mock data...")
        db = SessionLocal()
        try:
            seed_mock_data(db)
            logger.info("Mock data seeded successfully!")
        except Exception as e:
            logger.error(f"Error seeding mock data: {e}")
        finally:
            db.close()
    elif settings.SEED_DATA:
        logger.info("Seeding admin user...")
        db = SessionLocal()
        try:
            seed_admin_user(db)
            logger.info("Admin user seeded successfully!")
        except Exception as e:
            logger.error(f"Error seeding admin user: {e}")
        finally:
            db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
