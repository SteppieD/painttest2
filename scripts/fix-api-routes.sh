#!/bin/bash

echo "Fixing API routes to use request.nextUrl instead of request.url..."

# Find all files with the pattern and replace
find app/api -name "*.ts" -type f -exec grep -l "new URL(request\.url)" {} \; | while read file; do
    echo "Fixing: $file"
    
    # Replace the pattern
    sed -i.bak 's/new URL(request\.url)/request.nextUrl/g' "$file"
    
    # Also fix the destructuring if needed
    sed -i.bak 's/const { searchParams } = request\.nextUrl/const searchParams = request.nextUrl.searchParams/g' "$file"
    
    # Remove backup files
    rm "${file}.bak"
done

# Also add dynamic export to these files
echo "Adding dynamic export to API routes..."
find app/api -name "*.ts" -type f -exec grep -l "request\.nextUrl" {} \; | while read file; do
    # Check if dynamic export already exists
    if ! grep -q "export const dynamic" "$file"; then
        echo "Adding dynamic export to: $file"
        # Add the export at the top after imports
        sed -i.bak '1s/^/export const dynamic = "force-dynamic";\n/' "$file"
        rm "${file}.bak"
    fi
done

echo "API routes fixed!"