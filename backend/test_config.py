import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from app.core.config import settings

def test_config():
    print(f"MOCK_MODE: {settings.MOCK_MODE}")
    print(f"SEED_DATA: {settings.SEED_DATA}")
    print(f"LOG_LEVEL: {settings.LOG_LEVEL}")

if __name__ == "__main__":
    test_config()