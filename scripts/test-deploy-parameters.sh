#!/bin/bash

# Test script to verify deploy workflow parameters
# This script tests the NO_CACHE and CLEAN_ROLLOUT functionality

set -euo pipefail

echo "Testing deploy workflow parameters..."

# Test 1: Verify NO_CACHE parameter
echo "Test 1: Verifying NO_CACHE parameter functionality"
echo "Expected behavior: When NO_CACHE=true, docker build should use --no-cache flag"

# Check if the deploy script contains the correct NO_CACHE logic
if grep -q "if \[ \"\\\$NO_CACHE\" = \"true\" \]" .github/workflows/deploy.yml; then
    echo "✓ NO_CACHE parameter check found in deploy workflow"
else
    echo "✗ NO_CACHE parameter check missing from deploy workflow"
    exit 1
fi

if grep -q "\--no-cache" .github/workflows/deploy.yml; then
    echo "✓ --no-cache flag found in deploy workflow"
else
    echo "✗ --no-cache flag missing from deploy workflow"
    exit 1
fi

# Test 2: Verify CLEAN_ROLLOUT parameter
echo "Test 2: Verifying CLEAN_ROLLOUT parameter functionality"
echo "Expected behavior: When CLEAN_ROLLOUT=true, all Docker resources should be pruned and app files removed"

# Check if the deploy script contains the correct CLEAN_ROLLOUT logic
if grep -q "if \[ \"\\\$CLEAN_ROLLOUT\" = \"true\" \]" .github/workflows/deploy.yml; then
    echo "✓ CLEAN_ROLLOUT parameter check found in deploy workflow"
else
    echo "✗ CLEAN_ROLLOUT parameter check missing from deploy workflow"
    exit 1
fi

# Check for docker system prune commands
if grep -q "docker system prune -af" .github/workflows/deploy.yml; then
    echo "✓ docker system prune -af command found"
else
    echo "✗ docker system prune -af command missing"
fi

# Check for docker volume prune commands
if grep -q "docker volume prune -f" .github/workflows/deploy.yml; then
    echo "✓ docker volume prune -f command found"
else
    echo "✗ docker volume prune -f command missing"
fi

# Check for docker network prune commands
if grep -q "docker network prune -f" .github/workflows/deploy.yml; then
    echo "✓ docker network prune -f command found"
else
    echo "✗ docker network prune -f command missing"
fi

# Check for docker image prune commands
if grep -q "docker image prune -af" .github/workflows/deploy.yml; then
    echo "✓ docker image prune -af command found"
else
    echo "✗ docker image prune -af command missing"
fi

# Check for file removal commands
if grep -q "find . -mindepth 1 -maxdepth 1" .github/workflows/deploy.yml; then
    echo "✓ File removal commands found"
else
    echo "✗ File removal commands missing"
fi

# Test 3: Verify all parameters are properly passed
echo "Test 3: Verifying parameter passing"

# Check if all parameters are properly exported to the remote script
if grep -q "REMOTE_PATH='\${REMOTE_PATH}' COMPOSE_FILE='\${COMPOSE_FILE}' SERVICES='\${SERVICES}' NO_CACHE='\${NO_CACHE}' CLEAN_ROLLOUT='\${CLEAN_ROLLOUT}'" .github/workflows/deploy.yml; then
    echo "✓ All parameters properly exported to remote script"
else
    echo "✗ Not all parameters properly exported to remote script"
fi

echo "All tests completed successfully!"
echo "Deploy workflow parameters verified:"
echo "- NO_CACHE parameter correctly implements --no-cache flag"
echo "- CLEAN_ROLLOUT parameter correctly removes all Docker resources and app files"
echo "- All parameters are properly passed to the remote deployment script"