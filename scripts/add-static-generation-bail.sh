#!/bin/bash

echo "Adding static generation bail to pages that might timeout..."

# Add export const dynamic = 'force-dynamic' to pages with heavy components
pages=(
  "app/page.tsx"
  "app/painting-contractors/page.tsx"
  "app/paint-contractor-app/page.tsx"
  "app/painting-estimate-software/page.tsx"
)

for page in "${pages[@]}"; do
  if [ -f "$page" ]; then
    # Check if it already has dynamic export
    if ! grep -q "export const dynamic" "$page"; then
      echo "Adding dynamic export to: $page"
      # Add after imports
      sed -i.bak '/^import/,/^[^i]/{
        /^[^i]/i\
export const dynamic = "force-dynamic";\
      }' "$page"
      rm "${page}.bak"
    fi
  fi
done

echo "Static generation bail added!"