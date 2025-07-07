#!/bin/bash

echo "Deploying to Vercel..."

# Check if logged in
vercel whoami || vercel login

# Link to existing project
echo "Linking to existing Vercel project..."
vercel link --yes

# Deploy to production
echo "Deploying to production..."
vercel --prod

echo "Deployment complete!"