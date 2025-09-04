"""
backend/app/utils/performance.py

Performance monitoring utilities for tracking operation timing and resource usage.
"""

import time
import logging
from functools import wraps
from typing import Callable, Any

logger = logging.getLogger(__name__)

class Timer:
    """Context manager for timing operations."""
    
    def __init__(self, operation_name: str, logger_instance: logging.Logger = None):
        self.operation_name = operation_name
        self.logger = logger_instance or logger
        self.start_time = None
        self.end_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        self.logger.info(f"Starting operation: {self.operation_name}")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.time()
        duration = self.end_time - self.start_time
        
        if exc_type is None:
            self.logger.info(f"Operation {self.operation_name} completed successfully in {duration:.3f}s")
        else:
            self.logger.error(f"Operation {self.operation_name} failed after {duration:.3f}s with error: {exc_val}")
        
        return False  # Don't suppress exceptions

def timed_operation(operation_name: str):
    """
    Decorator to time function execution.
    
    Args:
        operation_name: Name of the operation for logging
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            with Timer(operation_name):
                return func(*args, **kwargs)
        return wrapper
    return decorator

def log_performance_metrics(operation_name: str, start_time: float, end_time: float, 
                          additional_metrics: dict = None):
    """
    Log performance metrics for an operation.
    
    Args:
        operation_name: Name of the operation
        start_time: Start timestamp
        end_time: End timestamp
        additional_metrics: Additional metrics to log
    """
    duration = end_time - start_time
    metrics = {
        "operation": operation_name,
        "duration_seconds": round(duration, 3),
        **(additional_metrics or {})
    }
    
    if duration > 1.0:  # Log as warning if operation takes more than 1 second
        logger.warning(f"Slow operation detected: {metrics}")
    else:
        logger.info(f"Operation metrics: {metrics}")

# Database query performance monitoring
def log_query_performance(query_type: str, query_complexity: str, duration: float, 
                         result_count: int = None):
    """
    Log database query performance metrics.
    
    Args:
        query_type: Type of query (SELECT, INSERT, UPDATE, DELETE)
        query_complexity: Complexity level (simple, complex, join)
        duration: Query execution time in seconds
        result_count: Number of results returned (for SELECT queries)
    """
    metrics = {
        "query_type": query_type,
        "complexity": query_complexity,
        "duration_seconds": round(duration, 3)
    }
    
    if result_count is not None:
        metrics["result_count"] = result_count
    
    if duration > 0.5:  # Log as warning if query takes more than 500ms
        logger.warning(f"Slow database query detected: {metrics}")
    else:
        logger.debug(f"Database query metrics: {metrics}")