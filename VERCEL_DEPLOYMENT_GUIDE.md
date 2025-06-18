# 🚀 Deploying PaintQuoteApp.com to Vercel

This guide will walk you through deploying your painting quote app to Vercel and connecting your custom domain.

## Prerequisites
- GitHub account (or GitLab/Bitbucket)
- paintquoteapp.com domain purchased from GoDaddy
- Your app code (already built and tested)

## Step 1: Push Code to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it: `paintquoteapp`
   - Make it private if you prefer
   - Don't initialize with README (you already have one)

2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/paintquoteapp.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with your GitHub account (easiest option)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your `paintquoteapp` repository
   - Vercel will detect it's a Next.js project automatically

3. **Configure Build Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `.` (leave as is)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: Leave empty (Next.js handles this)
   - **Install Command**: `npm install` (default)

4. **Environment Variables**
   - Click "Environment Variables"
   - Add your Google Gemini API key:
     - Name: `NEXT_PUBLIC_GOOGLE_API_KEY`
     - Value: Your API key from Google AI Studio
   - Add any other environment variables from your `.env.local` file

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - You'll get a URL like: `paintquoteapp-xxxxx.vercel.app`

## Step 3: Add Custom Domain

1. **In Vercel Dashboard**
   - Go to your project settings
   - Click "Domains" in the left sidebar
   - Type `paintquoteapp.com` and click "Add"
   - Also add `www.paintquoteapp.com`

2. **Vercel will show you DNS records to add**
   You'll see something like:
   ```
   A Record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
   ```

## Step 4: Configure GoDaddy DNS

1. **Login to GoDaddy**
   - Go to https://godaddy.com
   - My Products → DNS for paintquoteapp.com

2. **Update DNS Records**
   - Delete any existing A records for @ (if any)
   - Add the records Vercel provided:
   
   **For the root domain (paintquoteapp.com):**
   - Type: A
   - Name: @
   - Value: 76.76.21.21 (use the IP Vercel gives you)
   - TTL: 600

   **For www subdomain:**
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com (use what Vercel gives you)
   - TTL: 600

3. **Save Changes**
   - Click "Save" in GoDaddy
   - DNS propagation can take 5-48 hours (usually 5-30 minutes)

## Step 5: Verify Domain in Vercel

1. Go back to Vercel → Domains
2. You'll see "Verifying" next to your domain
3. Once DNS propagates, it will show "Valid Configuration" ✅
4. Vercel automatically provisions SSL certificates

## Step 6: Final Configuration

1. **Set Production Domain**
   - In Vercel → Settings → Domains
   - Set `paintquoteapp.com` as the primary domain
   - `www.paintquoteapp.com` will redirect to the main domain

2. **Environment Variables for Production**
   - Double-check all environment variables are set
   - Especially the Google API key

## Testing Your Live Site

Once DNS propagates, test:
- https://paintquoteapp.com
- https://www.paintquoteapp.com
- Try creating a quote
- Test the admin panel
- Check mobile responsiveness

## Troubleshooting

**Site not loading?**
- DNS can take up to 48 hours (but usually much faster)
- Use https://dnschecker.org to check propagation
- Make sure you added both A and CNAME records

**Build failing?**
- Check build logs in Vercel dashboard
- Make sure all dependencies are in package.json
- Environment variables might be missing

**Database issues?**
- SQLite database will be created fresh on Vercel
- You'll need to use the seed data or manually add companies

## Ongoing Deployment

After initial setup, any push to your GitHub main branch will:
1. Trigger automatic deployment on Vercel
2. Build and deploy in ~2 minutes
3. Zero downtime deployment

## Costs

- **Vercel Free Tier**: Includes
  - 100GB bandwidth/month
  - Unlimited deployments
  - SSL certificates
  - Global CDN
  
- **When to upgrade**: Only if you exceed 100GB bandwidth (thousands of users)

## Support

- Vercel Support: https://vercel.com/support
- DNS Issues: Check GoDaddy support
- App Issues: You have the code and can modify as needed!

---

Your app will be live at https://paintquoteapp.com within minutes to hours after DNS setup! 🎉