import logging
from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema, Token
from app.auth.password import get_password_hash
from app.auth.providers.factory import get_provider
from app.auth.config import get_current_auth_provider

logger = logging.getLogger(__name__)

router = APIRouter()

# Get the authentication provider based on settings
AUTH_PROVIDER_NAME = get_current_auth_provider()
auth_provider = get_provider(AUTH_PROVIDER_NAME)


@router.post("/register", response_model=UserSchema)
async def register(*, db: Session = Depends(get_db), user_in: UserCreate) -> Any:
    """
    Register a new user.
    """
    logger.info(f"Registering new user with email: {user_in.email}")
    logger.debug(f"Registration data: first_name={user_in.first_name}, last_name={user_in.last_name}, role={user_in.role}")
    
    # Check if user with this email already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        logger.warning(f"Registration failed: User with email {user_in.email} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
    
    # Check if passwords match
    if user_in.password != user_in.confirm_password:
        logger.warning(f"Registration failed: Passwords do not match for user {user_in.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )
    
    # Check if role is valid
    if user_in.role not in ["creative", "client", "admin"]:
        logger.warning(f"Registration failed: Invalid role {user_in.role} for user {user_in.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'creative', 'client', or 'admin'."
        )
    
    # Create new user
    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
        bio=user_in.bio,
        location=user_in.location,
        profile_image_url=user_in.profile_image_url,
        is_active=True,
        is_verified=False,
    )
    logger.info(f"User {user_in.email} registered successfully with role {user_in.role}")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"User {db_user.email} created with ID {db_user.id}")
    return db_user


@router.post("/login", response_model=Token)
async def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    logger.info(f"Login attempt for user: {form_data.username}")
    logger.debug(f"Login request from IP: (would be added in production)")
    
    # Authenticate user using the configured provider
    credentials = {
        "email": form_data.username,
        "password": form_data.password
    }
    
    user = await auth_provider.authenticate(db, credentials)
    if not user:
        logger.warning(f"Login failed: Invalid credentials for user {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        logger.warning(f"Login failed: User {form_data.username} is inactive")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token using the configured provider
    access_token = await auth_provider.create_token(user)
    
    logger.info(f"User {user.email} logged in successfully")
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout():
    """
    Logout user by clearing the JWT token cookie and redirecting to homepage
    """
    logger.info("User logout requested")
    
    # Create a response that clears the token cookie and redirects to homepage
    response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
    response.delete_cookie("access_token")  # Clear the access token cookie if it exists
    
    logger.info("User logged out successfully")
    return response
