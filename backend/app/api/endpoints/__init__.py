# Import routers for use in api.py
from .users import router as users
from .auth import router as auth
from .gigs import router as gigs
from .applications import router as applications
from .messages import router as messages
from .payments import router as payments
from .gig_file import router as gig_file
from .notifications import router as notifications
from .notification_settings import router as notification_settings
from .admin import router as admin
from .dashboard import router as dashboard
