import os
from pydantic import BaseModel
from typing import Optional, List

class Settings(BaseModel):
    PROJECT_NAME: str = "B3ACON Creative Connect"
    PROJECT_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/beacon")
    
    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt-please-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # File storage
    UPLOAD_DIRECTORY: str = "uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    
    # Stripe settings
    STRIPE_API_KEY: Optional[str] = os.getenv("STRIPE_API_KEY")
    STRIPE_WEBHOOK_SECRET: Optional[str] = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    # Email settings
    SENDGRID_API_KEY: Optional[str] = os.getenv("SENDGRID_API_KEY")
    EMAIL_FROM: str = "noreply@beacon-connect.com"
    EMAIL_FROM_NAME: str = "B3ACON Creative Connect"
    
    # Mock data settings
    MOCK_MODE: bool = os.getenv("MOCK_MODE", "false").lower() == "true"
    SEED_DATA: bool = os.getenv("SEED_DATA", "false").lower() == "true"
    
    # Logging settings
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()
