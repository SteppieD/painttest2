# 🚂 Deploy to Railway - 5 Minute Setup

Railway is much simpler than Vercel for full-stack apps. Let's get your app live quickly!

## Step 1: Push to GitHub (if not already done)

```bash
git add .
git commit -m "🚂 Prepare for Railway deployment"
git push origin main
```

## Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Choose "Deploy from GitHub repo"**
5. **Select your `painttest2` repository**
6. **Railway will auto-deploy!**

## Step 3: Add Environment Variables

In Railway dashboard:
1. Click your project → **Variables** tab
2. Add these 4 variables:

```env
GEMINI_API_KEY=AIzaSyCUIGerwUQl5gYegOEWd44m4QHd1XKQ51k
NEXT_PUBLIC_SUPABASE_URL=https://opcbwsfdhergcjjobryp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2J3c2ZkaGVyZ2Nqam9icnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDUyMTEsImV4cCI6MjA2MzcyMTIxMX0.f0DSkDqZ-h8bup57qf8z0aOaJ3fLTf8fDfxgvHn-G6Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2J3c2ZkaGVyZ2Nqam9icnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE0NTIxMSwiZXhwIjoyMDYzNzIxMjExfQ.m2yISMmhwQjoEMmPDDN8XTFT5_ojSmlklZJJ49kuMQg
```

## Step 4: Test Your App

Railway will give you a URL like: `https://painttest2-production.up.railway.app`

Test the trial signup - it should work perfectly!

## Why Railway is Better for This

- ✅ **Supports SQLite** out of the box
- ✅ **No API route issues** like Vercel
- ✅ **Automatic builds** from GitHub
- ✅ **Simple configuration**
- ✅ **Great for full-stack apps**
- ✅ **Free tier** with 500 hours/month

## Cost Comparison

**Railway**: $0-5/month for your app size
**Vercel**: Fighting with configuration issues 😤

## Custom Domain Later

Once working on Railway, you can add `app.paintquoteapp.com` domain in Railway settings.

**Let's do this! Railway will have your app working in 5 minutes.** 🚂