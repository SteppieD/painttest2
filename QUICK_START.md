# 🚀 Quick Start Guide - Paint Quote Pro

Get the painting quote application running in under 5 minutes!

## Prerequisites
- Node.js 18+ installed
- Git installed
- Vercel CLI (`npm i -g vercel`)
- Supabase account (free tier works)

## 1️⃣ Clone & Install (2 minutes)
```bash
# Clone the repository
git clone https://github.com/yourusername/painttest2.git
cd painttest2

# Install dependencies
npm install
```

## 2️⃣ Quick Supabase Setup (3 minutes)

### Option A: Use Existing Supabase (If you have credentials)
```bash
# Create .env.local file
cp .env.example .env.local

# Add your Supabase credentials to .env.local:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Option B: New Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (takes ~2 minutes to provision)
3. Go to Settings → API
4. Copy your credentials to `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role secret → `SUPABASE_SERVICE_ROLE_KEY`

## 3️⃣ Deploy to Vercel (1 minute)
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod

# Follow the prompts:
# - Link to existing project? No
# - What's your project name? paintquote-pro
# - In which directory? ./ (current directory)
# - Override settings? No
```

## 4️⃣ Add Environment Variables to Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the same variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Redeploy: `vercel --prod`

## ✅ You're Live!

### Test Your Deployment
1. **Customer Access**: Visit your-app.vercel.app
   - Use access code: `DEMO2024`
   - Create quotes and explore features

2. **Admin Portal**: Visit your-app.vercel.app/admin
   - Login: admin@paintingapp.com / admin123
   - Manage customers and view analytics

## 🔧 Local Development
```bash
# Start development server
npm run dev

# Visit http://localhost:3001
```

## 📱 Key Features to Test
1. **Quick Quote Creation**: Use the AI chat to create a quote in seconds
2. **Dashboard Analytics**: View business metrics and revenue
3. **Mobile Responsive**: Test on your phone
4. **Admin Portal**: Full customer management system

## 🆘 Troubleshooting

### "Invalid Date" or "$0" quotes
- Check Supabase environment variables in Vercel
- Ensure all three Supabase keys are set
- Redeploy after adding variables

### Build errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database connection issues
- Check Supabase project is active (not paused)
- Verify API keys are correct
- Test at `/api/test-supabase`

## 🎯 Next Steps
1. **Customize Branding**: Update logo and colors in `/settings/branding`
2. **Add Paint Products**: Configure your paint products in setup wizard
3. **Set Pricing**: Adjust markup and labor rates
4. **Invite Team**: Create access codes for your team

## 📚 More Resources
- [Full Documentation](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Development Guide](CLAUDE.md)
- [API Documentation](/api-docs)

---

**Need Help?** 
- Check existing [issues](https://github.com/yourusername/painttest2/issues)
- Contact support@paintquotepro.com