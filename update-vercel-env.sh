#!/bin/bash

# Update Vercel production environment variables with correct Supabase keys

echo "🔄 Updating Vercel production environment variables..."

# Set the Vercel token
export VERCEL_TOKEN="1REWBlNgip69vugG50zEpx8B"

# Update NEXT_PUBLIC_SUPABASE_ANON_KEY
echo "Updating NEXT_PUBLIC_SUPABASE_ANON_KEY..."
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>/dev/null || true
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2J3c2ZkaGVyZ2Nqam9icnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDUyMTEsImV4cCI6MjA2MzcyMTIxMX0.f0DSkDqZ-h8bup57qf8z0aOaJ3fLTf8fDfxgvHn-G6Q" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Update SUPABASE_SERVICE_ROLE_KEY
echo "Updating SUPABASE_SERVICE_ROLE_KEY..."
vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes 2>/dev/null || true
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2J3c2ZkaGVyZ2Nqam9icnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE0NTIxMSwiZXhwIjoyMDYzNzIxMjExfQ.m2yISMmhwQjoEMmPDDN8XTFT5_ojSmlklZJJ49kuMQg" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "✅ Environment variables updated!"
echo "🚀 Triggering new deployment..."

# Trigger a new deployment to apply the changes
vercel --prod

echo "✅ Deployment triggered! Check https://painttest2.vercel.app in a few minutes."