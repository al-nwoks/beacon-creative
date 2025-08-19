#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
  echo "Shutting down containers..."
  docker-compose down
  exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Check if .env files exist, if not create them from examples
if [ ! -f "frontend/.env.local" ]; then
  echo "Creating frontend/.env.local from example..."
  cp frontend/.env.example frontend/.env.local
fi

if [ ! -f "backend/.env" ]; then
  echo "Creating backend/.env from example..."
  cp backend/.env.example backend/.env
fi

# Build and start the containers
echo "Building and starting containers..."
docker-compose up --build

# This will only run if docker-compose exits on its own
cleanup
