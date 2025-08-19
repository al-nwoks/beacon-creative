#!/bin/bash
# Usage: ./init_repo.sh <repo_name>
# Initializes a new git repo in the specified directory, adds a .gitignore, and sets the remote origin.

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <repo_name>"
  exit 1
fi

REPO_NAME="$1"
DIR="$REPO_NAME"

# Create directory if it doesn't exist
mkdir -p "$DIR"
cd "$DIR"

# Initialize git repo
if [ ! -d ".git" ]; then
  git init
fi

# Add .gitignore if not present
if [ ! -f ".gitignore" ]; then
  echo "# Python
__pycache__/
*.pyc
*.pyo
*.pyd
venv/
.env
# Node
node_modules/
dist/
.env
# Mac
.DS_Store
" > .gitignore
fi

git add .gitignore

git commit -m "Add .gitignore"

git remote remove origin 2>/dev/null || true

git remote add origin "git@github.com:<your-username>/$REPO_NAME.git"

echo "Initialized repo '$REPO_NAME' with .gitignore and remote origin set."
