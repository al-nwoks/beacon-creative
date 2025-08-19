import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from jose import jwt
from pydantic import UUID4

from app.core.config import settings

logger = logging.getLogger(__name__)

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    """
    logger.debug(f"Creating access token for subject: {subject}")
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    logger.debug(f"Access token created successfully for subject: {subject}, expires at: {expire}")
    return encoded_jwt

def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode a JWT access token
    """
    logger.debug("Decoding access token")
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        logger.debug(f"Access token decoded successfully for subject: {decoded_token.get('sub')}")
        return decoded_token
    except Exception as e:
        logger.error(f"Failed to decode access token: {str(e)}")
        raise
