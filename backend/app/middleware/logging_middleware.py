import time
import logging
from fastapi import Request, Response
from fastapi.routing import APIRoute
import uuid

# Create a logger for the middleware
logger = logging.getLogger("backend.middleware")


class LoggingMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # Generate a unique request ID
        request_id = str(uuid.uuid4())[:8]
        
        # Create a logger adapter with the request ID
        request_logger = logging.LoggerAdapter(logger, {"request_id": request_id})
        
        # Store start time
        start_time = time.time()
        
        # Create request object
        request = Request(scope, receive)
        
        # Log request start
        request_logger.info(f"REQUEST START - {request.method} {request.url.path} - Client: {request.client.host}")
        
        # Store response status for logging
        response_status = None
        
        async def send_with_logging(message):
            nonlocal response_status
            if message["type"] == "http.response.start":
                response_status = message["status"]
            await send(message)
        
        try:
            await self.app(scope, receive, send_with_logging)
        finally:
            # Calculate duration
            duration = time.time() - start_time
            
            # Log request completion
            if response_status:
                request_logger.info(f"REQUEST END - {request.method} {request.url.path} - Status: {response_status} - Duration: {duration:.3f}s")
            else:
                request_logger.info(f"REQUEST END - {request.method} {request.url.path} - Duration: {duration:.3f}s")