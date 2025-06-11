#!/bin/bash

echo "🧹 Clearing all caches for painting quote app..."

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -f tsconfig.tsbuildinfo
rm -f .eslintcache

# Kill any running dev servers
echo "Stopping any running dev servers..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Clear Docker containers if needed
echo "Checking Docker containers..."
docker stop painttest2-container 2>/dev/null || true
docker rm painttest2-container 2>/dev/null || true

echo "✅ All caches cleared!"
echo ""
echo "To clear browser cache:"
echo "1. Open Chrome DevTools (F12)"
echo "2. Right-click the refresh button"
echo "3. Select 'Empty Cache and Hard Reload'"
echo ""
echo "Or run this in the browser console:"
echo "localStorage.clear(); sessionStorage.clear(); location.reload(true);"