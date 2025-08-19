#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
  echo "Shutting down servers..."
  kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
  exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Start the frontend development server
echo "Starting frontend development server..."
cd frontend && ./start-dev.sh &
FRONTEND_PID=$!

# Start the backend development server
echo "Starting backend development server..."
cd backend && ./start-dev.sh &
BACKEND_PID=$!

echo "Both servers are running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo "Press Ctrl+C to stop both servers."

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID
