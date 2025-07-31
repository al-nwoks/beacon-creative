#!/bin/bash

# Check if nvm is installed
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  source "$HOME/.nvm/nvm.sh"
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
  source "/usr/local/opt/nvm/nvm.sh"
else
  echo "NVM is not installed. Please install NVM first."
  exit 1
fi

# Use the Node.js version specified in .nvmrc
echo "Setting Node.js version from .nvmrc..."
nvm use || nvm install

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting Next.js development server..."
npm run dev
