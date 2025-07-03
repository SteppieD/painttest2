# Vercel Private Repository Deployment Fix

## Quick Diagnosis Steps

### 1. Check GitHub App Permissions
Go to: https://github.com/settings/installations

- Find "Vercel" in your installed GitHub Apps
- Click "Configure"
- Under "Repository access":
  - Either select "All repositories" OR
  - Select "Only select repositories" and ensure `SteppieD/painttest2` is checked
- Click "Save"

### 2. Verify in Vercel
Go to: https://vercel.com/account/login-connections

- Click "Manage" or "Configure" next to GitHub
- You should see your GitHub username
- Click to ensure proper connection

### 3. Force Reconnect Your Project

In your Vercel Project Settings:

1. Go to "Git" section
2. Click "Disconnect from Git" 
3. Confirm disconnection
4. Click "Connect Git Repository"
5. Select GitHub
6. You should now see your private repo `SteppieD/painttest2`
7. Select it and connect

## If Still Having Issues

### Option A: Create Deploy Token
1. Go to: https://vercel.com/account/tokens
2. Create a new token with name "painttest2-deploy"
3. Copy the token

### Option B: Use Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login with your account
vercel login

# Link your project
vercel link

# Deploy directly
vercel --prod
```

### Option C: Manual Deploy via Dashboard
1. Go to your Vercel dashboard
2. Click "Add New" → "Project"
3. Instead of "Import Git Repository", click "Deploy from CLI"
4. Follow the instructions

## Environment Variables to Set

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_key_here
OPENROUTER_API_KEY=your_actual_key_here
NEXTAUTH_SECRET=generate_random_32_char_string
NEXTAUTH_URL=https://www.paintquoteapp.com
NODE_ENV=production
```

## Build Settings Checklist

- Framework Preset: **Next.js**
- Build Command: **npm run build**
- Output Directory: **.next**
- Install Command: **npm install**
- Node.js Version: **20.x** (not 22.x)
- Root Directory: **[leave empty]**

## Common Private Repo Issues

1. **"Repository not found"**
   - GitHub permissions not properly set
   - Need to reconnect GitHub integration

2. **"Build failed"**
   - Check build logs for missing env variables
   - Ensure all dependencies are in package.json

3. **"No commits found"**
   - Git connection is broken
   - Use the disconnect/reconnect method

## Test Deployment

After fixing, push a small change:

```bash
echo "# Deploy test" >> README.md
git add README.md
git commit -m "Test Vercel deployment"
git push origin main
```

## Emergency Workaround

If nothing works, temporarily make repo public:
1. Deploy to Vercel
2. Make repo private again
3. Future pushes should work

## Support Contact

If still having issues:
- Vercel Support: https://vercel.com/support
- Reference your User ID: 75CQkjJuuT0d0w8YLfvQ2sZ4
- Mention: "Private GitHub repository deployment failing after changing from public"