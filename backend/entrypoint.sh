#!/bin/bash
# Entrypoint script for the backend service
# This script waits for dependencies, runs migrations, and then starts the application

set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
./wait-for-it.sh db 5432 60

# Run database migrations
echo "Running database migrations..."
./migrate.sh

# Start the application
echo "Starting the application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000