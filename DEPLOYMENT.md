# 🚀 Deployment Guide - Paint Quote Pro

Comprehensive deployment instructions for multiple platforms.

## Table of Contents
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Railway Deployment](#railway-deployment)
- [Render Deployment](#render-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment Setup](#post-deployment-setup)
- [Troubleshooting](#troubleshooting)

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account (free tier works)
- GitHub account (optional)
- Supabase project

### Method 1: Vercel CLI (Fastest)
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Build the project first
npm run build

# Deploy to production
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - What's your project name? paintquote-pro
# - In which directory? ./ (current)
# - Override settings? No
```

### Method 2: GitHub Integration
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/paintquote-pro.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

5. Add environment variables in the UI (see [Environment Variables](#environment-variables))
6. Click "Deploy"

### Adding Environment Variables in Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable for Production environment:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```
3. Redeploy to apply changes:
   ```bash
   vercel --prod
   ```

## Railway Deployment

### One-Click Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Manual Setup
1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Next.js configuration

### Configuration
Create `railway.toml` in your project root:
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Environment Variables
1. Go to your project → Variables tab
2. Add all required variables
3. Railway automatically redeploys on changes

## Render Deployment

### Setup
1. Create account at [render.com](https://render.com)
2. New → Web Service → Connect GitHub repo
3. Configure:
   - Name: paintquote-pro
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: Free (or upgrade as needed)

### render.yaml Configuration
Create `render.yaml` in project root:
```yaml
services:
  - type: web
    name: paintquote-pro
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_SUPABASE_URL
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
```

## Self-Hosted Deployment

### Using Docker
Create `Dockerfile`:
```dockerfile
# Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

### Using PM2
```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'paintquote-pro',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
};
```

## Environment Variables

### Required Variables
```env
# Supabase Configuration (Required for Production)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Optional Variables
```env
# AI Services (Falls back to mock data if not set)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Email Service (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Payment Processing (Stripe)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_POSTHOG_KEY=phc_...

# Other
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Getting Supabase Credentials
1. Create free project at [supabase.com](https://supabase.com)
2. Wait for project to finish provisioning (~2 minutes)
3. Go to Settings → API
4. Copy credentials:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## Post-Deployment Setup

### 1. Verify Deployment
```bash
# Check basic connectivity
curl https://your-app.vercel.app/api/test-connection

# Check database connection
curl https://your-app.vercel.app/api/test-supabase

# Should return success messages
```

### 2. Initial Access
- **Customer Portal**: Use access code `DEMO2024`
- **Admin Portal**: Visit `/admin`, login with:
  - Email: admin@paintingapp.com
  - Password: admin123
  - **⚠️ Change this immediately!**

### 3. Configure Your Business
1. After login, visit `/setup`
2. Complete the setup wizard:
   - Company name and details
   - Paint products and pricing
   - Labor rates and markup
   - Favorite products selection

### 4. Create Access Codes
1. Go to Admin Panel → Access Codes
2. Create codes for your team:
   - Each code creates a separate company instance
   - Set appropriate quotas
   - Track usage per code

### 5. Custom Domain Setup

**Vercel**:
1. Go to Settings → Domains
2. Add your domain (e.g., quotes.yourcompany.com)
3. Update DNS records:
   ```
   Type: CNAME
   Name: quotes
   Value: cname.vercel-dns.com
   ```

**Railway/Render**:
- Follow platform-specific custom domain guides

## Troubleshooting

### Common Issues & Solutions

**"Invalid Date" or "$0" in quotes**
```bash
# Missing Supabase environment variables
# Solution: Add all 3 Supabase keys in deployment platform
# Then redeploy
vercel --prod
```

**Build Failures**
```bash
# Clear all caches and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Database Connection Failed**
- Supabase free tier pauses after 1 week of inactivity
- Go to Supabase dashboard and unpause project
- Verify all 3 environment variables are set correctly
- Test at `/api/test-supabase`

**White-on-White Text Issues**
- Already fixed in latest version
- Clear browser cache if still seeing issues
- Check `/app/globals.css` for contrast rules

**Performance Issues**
1. Enable static optimization in `next.config.js`:
   ```javascript
   module.exports = {
     output: 'standalone',
     poweredByHeader: false,
     compress: true,
   }
   ```
2. Use image optimization
3. Enable caching headers
4. Consider CDN for static assets

### Debug Endpoints
- `/api/test-connection` - Basic health check
- `/api/test-db` - SQLite connectivity
- `/api/test-supabase` - Supabase connection
- `/api/test-ai-config` - AI service status
- `/debug-env` - Environment check (disable in production!)

## Production Checklist

Before going live:
- [ ] All environment variables set correctly
- [ ] Admin password changed from default
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Custom domain configured (optional)
- [ ] Email sending tested
- [ ] Payment processing configured
- [ ] Access codes created for team
- [ ] Company branding uploaded
- [ ] Paint products configured
- [ ] Pricing and markup set
- [ ] Test quote creation flow
- [ ] Test admin functions

## Monitoring & Maintenance

### Recommended Monitoring
- **Uptime**: UptimeRobot, Pingdom
- **Errors**: Sentry, LogRocket
- **Analytics**: Vercel Analytics, Google Analytics
- **Performance**: PageSpeed Insights, GTmetrix

### Regular Maintenance Tasks
```bash
# Monthly: Update dependencies
npm update
npm audit fix

# Weekly: Check logs
vercel logs

# Daily: Monitor Supabase usage
# Check dashboard for quota limits

# Backup: Export data regularly
# Use Supabase dashboard or API
```

### Scaling Considerations
- **Database**: Upgrade Supabase plan for more connections
- **Compute**: Increase Vercel/Railway resources
- **Storage**: Monitor image uploads and quotes
- **API Limits**: Track AI API usage

## Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Rotate keys quarterly
   - Use different keys for dev/prod

2. **Access Control**:
   - Change default admin password
   - Use strong access codes
   - Monitor usage patterns

3. **Data Protection**:
   - Enable Supabase RLS
   - Regular backups
   - GDPR compliance

4. **Updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Apply patches promptly

---

**Need Help?**
- 📖 Check [QUICK_START.md](QUICK_START.md) for rapid setup
- 📚 Review [README.md](README.md) for features overview
- 🛠️ See [CLAUDE.md](CLAUDE.md) for development patterns
- 🐛 Report issues on GitHub