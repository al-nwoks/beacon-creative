#!/bin/bash

# Check if virtual environment exists
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
  echo "Installing dependencies..."
  pip install -r requirements.txt
fi

# Run database migrations
echo "Running database migrations..."
alembic upgrade head || echo "Warning: Database migrations failed. Make sure PostgreSQL is running."

# Start the development server
echo "Starting FastAPI development server..."
uvicorn app.main:app --reload
