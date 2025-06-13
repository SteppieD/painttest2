#!/bin/bash

echo "🔧 Updating quote creation to use improved parser..."

# Backup the original
cp app/create-quote/page.tsx app/create-quote/page.tsx.backup

# Update the import in create-quote page
sed -i '' 's|from "@/lib/professional-conversation-parser"|from "@/lib/improved-conversation-parser"|g' app/create-quote/page.tsx

echo "✅ Updated create-quote page to use improved parser"
echo ""
echo "The improved parser will:"
echo "- Better handle names like 'Hillary, the address is 9090 Hillside Lane'"
echo "- Automatically estimate ceiling area from linear feet"
echo "- Not get stuck in conversation loops"
echo "- Provide more helpful responses"
echo ""
echo "Restart your Docker container to apply changes:"
echo "docker restart painttest2-container"