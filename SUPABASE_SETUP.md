# 🚀 Supabase PostgreSQL Setup for PaintQuoteApp

## Step 1: Create Supabase Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up/Login** with GitHub (easiest)
3. **Create New Project**:
   - **Name**: `paintquoteapp`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier (includes 500MB database)

## Step 2: Set Up Database Schema

1. **In Supabase Dashboard** → **SQL Editor**
2. **Copy and paste** the entire contents of `/lib/database/supabase-schema.sql`
3. **Click "Run"** to create all tables and demo data

## Step 3: Get API Keys

1. **Go to Settings** → **API**
2. **Copy these values**:
   - **Project URL** (looks like: `https://abc123.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role secret key** (starts with `eyJ...`)

## Step 4: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **Add these 3 variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: 
- Use your actual values from Step 3
- Make sure to set for **Production**, **Preview**, and **Development**
- Click **"Save"** after adding each variable

## Step 5: Deploy & Test

1. **Push code to GitHub** (I'll do this)
2. **Vercel auto-deploys** (takes ~2 minutes)
3. **Test trial signup** at your live URL
4. **Verify data** in Supabase dashboard → **Table Editor**

## Step 6: Verify Setup

After deployment, check:
- ✅ **Trial signup works** without JSON errors
- ✅ **Companies appear** in Supabase Table Editor
- ✅ **Demo companies** are visible (DEMO2024, PAINTER001, CONTRACTOR123)

## Troubleshooting

**"Missing Supabase environment variables"**
- Double-check variable names match exactly
- Ensure all 3 variables are set in Vercel
- Redeploy after adding variables

**"Failed to create trial account"**
- Check Supabase dashboard → **Logs** for detailed errors
- Verify schema was created correctly
- Check if RLS policies are too restrictive

**Database connection issues**
- Verify project URL is correct (no trailing slash)
- Check if Supabase project is paused (free tier auto-pauses)
- Ensure service role key has correct permissions

## Benefits of Supabase

- ✅ **Free 500MB database** (perfect for getting started)
- ✅ **Real-time subscriptions** (for future features)
- ✅ **Built-in auth** (if you want to expand authentication)
- ✅ **Dashboard UI** (easy to view and edit data)
- ✅ **Automatic backups** (peace of mind)
- ✅ **No server management** (fully managed)

## Cost Scaling

- **Free**: 500MB database, 50MB file storage
- **Pro ($25/month)**: 8GB database, 100GB storage
- **Pay-as-you-grow**: Perfect for a growing business

Your app is ready to handle thousands of quotes on the free tier! 🎉