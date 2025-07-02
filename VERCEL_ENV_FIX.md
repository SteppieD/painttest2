# 🔧 Vercel Environment Variables Fix

## The Issue
Your existing Supabase project is working, but Vercel doesn't have the environment variables configured, so quotes aren't saving in production.

## Quick Fix (5 minutes)

### Step 1: Get Your Supabase Keys
1. **Go to**: https://supabase.com/dashboard/project/opcbwsfdhergcjjobrip
2. **Click**: Settings → API
3. **Copy these values**:

```
Project URL: https://opcbwsfdhergcjjobrip.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (starts with eyJ)
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (starts with eyJ, different from above)
```

### Step 2: Add to Vercel
1. **Go to**: Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Add these 3 variables** (paste your actual values):

```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://opcbwsfdhergcjjobrip.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development

Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your anon key)
Environments: ✅ Production ✅ Preview ✅ Development

Variable Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your service role key)
Environments: ✅ Production ✅ Preview ✅ Development
```

### Step 3: Redeploy
1. **Push any change** to trigger deployment:
   ```bash
   git commit --allow-empty -m "Trigger redeploy for env vars"
   git push
   ```
2. **Wait 2 minutes** for deployment
3. **Test quote creation** on your live site

## Verification
After the fix:
- ✅ **Create a test quote** - should show real data, not "Invalid Date"
- ✅ **Check Supabase dashboard** → Table Editor → quotes - should see your test quote
- ✅ **Visit**: `your-site.vercel.app/api/test-supabase` - should return success

## If Still Not Working
1. **Check browser console** for error messages
2. **Verify environment variable names** are exactly as shown above
3. **Make sure all 3 checkboxes** are checked for each variable
4. **Try hard refresh** after deployment (Cmd+Shift+R)

That's it! Your existing Supabase database just needs to be connected to Vercel. 🚀