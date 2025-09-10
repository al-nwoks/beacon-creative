#!/bin/bash
# Use netcat to wait for a service to be available
# Usage: ./wait-for-it.sh host port [timeout]
# Example: ./wait-for-it.sh db 5432 30

set -e

host="$1"
port="$2"
timeout="${3:-30}"

echo "Waiting for $host:$port to be available (timeout: ${timeout}s)..."

start_time=$(date +%s)
while ! nc -z "$host" "$port"; do
  current_time=$(date +%s)
  elapsed_time=$((current_time - start_time))
  
  if [ "$elapsed_time" -ge "$timeout" ]; then
    echo "Timeout: Could not connect to $host:$port within ${timeout} seconds"
    exit 1
  fi
  
  echo "Still waiting for $host:$port... (${elapsed_time}s elapsed)"
  sleep 1
done

echo "$host:$port is available"