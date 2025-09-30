#!/bin/bash

# Script to fix API base URL duplication issue across all frontend API routes
# This replaces the local apiBase() function with the shared getApiBase() utility

echo "Fixing API route files..."

# Find all route.ts files in frontend/src/app/api
find frontend/src/app/api -name "route.ts" -type f | while read -r file; do
    echo "Processing: $file"
    
    # Check if file contains the problematic apiBase function
    if grep -q "function apiBase()" "$file"; then
        # Create a backup
        cp "$file" "$file.bak"
        
        # Replace the import and function
        sed -i.tmp '
            1s/^/import { getApiBase } from "@\/lib\/apiBase"\n/
            /^function apiBase() {/,/^}$/d
            s/apiBase()/getApiBase()/g
        ' "$file"
        
        # Remove the temporary file
        rm "$file.tmp" 2>/dev/null || true
        
        echo "Fixed: $file"
    else
        echo "Skipped: $file (no apiBase function found)"
    fi
done

echo "API route fix completed!"