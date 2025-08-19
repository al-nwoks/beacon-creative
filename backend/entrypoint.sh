#!/bin/bash
# Entrypoint script for the backend service
# This script runs migrations and then starts the application

set -e

# Run database migrations
echo "Running database migrations..."
./migrate.sh

# Start the application
echo "Starting the application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000