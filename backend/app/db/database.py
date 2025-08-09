import logging
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine, pool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.engine import Engine

from app.core.config import settings

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Enhanced database manager with connection pooling and better session management."""
    
    def __init__(self):
        self.engine: Engine = None
        self.SessionLocal = None
        self._setup_engine()
        self._setup_session_factory()
    
    def _setup_engine(self):
        """Set up SQLAlchemy engine with connection pooling."""
        logger.info("Creating SQLAlchemy engine with connection pooling")
        
        # Enhanced engine configuration with connection pooling
        engine_kwargs = {
            "echo": False,  # Set to True for SQL logging in development
            "pool_size": 20,  # Number of connections to maintain in the pool
            "max_overflow": 30,  # Additional connections that can be created on demand
            "pool_pre_ping": True,  # Validate connections before use
            "pool_recycle": 3600,  # Recycle connections every hour
            "connect_args": {}
        }
        
        # PostgreSQL specific optimizations
        if "postgresql" in settings.DATABASE_URL:
            engine_kwargs["connect_args"] = {
                "connect_timeout": 10,
                "application_name": "beacon_backend"
            }
            engine_kwargs["poolclass"] = pool.QueuePool
        # SQLite specific settings (for development)
        elif "sqlite" in settings.DATABASE_URL:
            engine_kwargs["connect_args"] = {"check_same_thread": False}
            engine_kwargs["poolclass"] = pool.StaticPool
        
        self.engine = create_engine(settings.DATABASE_URL, **engine_kwargs)
        logger.info(f"Database engine created successfully for: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'local'}")
    
    def _setup_session_factory(self):
        """Set up session factory with optimized settings."""
        logger.info("Creating optimized session factory")
        self.SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine,
            expire_on_commit=False  # Keep objects accessible after commit
        )
    
    @contextmanager
    def get_session(self) -> Generator[Session, None, None]:
        """Context manager for database sessions with automatic cleanup."""
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logger.error(f"Database session error: {str(e)}")
            raise
        finally:
            session.close()
    
    def get_db_session(self) -> Session:
        """Get a new database session (for dependency injection)."""
        return self.SessionLocal()
    
    def close_engine(self):
        """Close the database engine and all connections."""
        if self.engine:
            logger.info("Closing database engine")
            self.engine.dispose()

# Global database manager instance
db_manager = DatabaseManager()

# Create base class for models
Base = declarative_base()

# Get the engine for external use (migrations, etc.)
engine = db_manager.engine

# Dependency to get DB session (FastAPI dependency injection)
def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency to get database session.
    Provides automatic session management with proper cleanup.
    """
    session = db_manager.get_db_session()
    try:
        yield session
    except Exception as e:
        session.rollback()
        logger.error(f"Database session error in dependency: {str(e)}")
        raise
    finally:
        session.close()

# Context manager for manual session handling
def get_db_context():
    """Context manager for database sessions outside of FastAPI."""
    return db_manager.get_session()

