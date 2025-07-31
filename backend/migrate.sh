#!/bin/bash
# Run Alembic migrations for deployment
# Usage: ./migrate.sh

set -e

cd "$(dirname "$0")"

# Activate virtual environment if needed
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run Alembic migrations
alembic upgrade head
