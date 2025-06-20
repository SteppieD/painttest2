# Digital Ocean Deployment Guide

## Option 1: Digital Ocean App Platform (Recommended)

### Step 1: Prepare the App
1. Make sure your app is pushed to GitHub
2. Update next.config.js for Digital Ocean compatibility
3. Add a Dockerfile (optional but recommended)

### Step 2: Deploy on Digital Ocean App Platform
1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect your GitHub repository (painttest2)
4. Choose branch: `main`
5. App Platform will auto-detect Next.js

### Step 3: Configure Environment Variables
Add these in the Digital Ocean dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`=`https://opcbwsfdhergcjjobrip.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`=`your_service_role_key`
- `GEMINI_API_KEY`=`your_gemini_key`
- `NODE_ENV`=`production`

### Step 4: Database Options
**Option A: Keep Supabase** (what we already set up)
- No changes needed, just use existing setup

**Option B: Digital Ocean Managed Database**
- Create PostgreSQL database in Digital Ocean
- Update connection strings
- Migrate schema from Supabase

**Option C: SQLite (simplest)**
- Use the existing SQLite setup since Digital Ocean supports full Node.js
- Remove Supabase adapter, use original SQLite code

## Option 2: Digital Ocean Droplet (More Control)

### Step 1: Create Ubuntu Droplet
1. Go to https://cloud.digitalocean.com/droplets
2. Create new droplet (Ubuntu 22.04)
3. Choose size (Basic $6/month should work)
4. Add SSH key

### Step 2: Install Dependencies
```bash
# SSH into droplet
ssh root@your_droplet_ip

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Nginx (optional, for reverse proxy)
apt install nginx
```

### Step 3: Deploy App
```bash
# Clone your repo
git clone https://github.com/your-username/painttest2.git
cd painttest2

# Install dependencies
npm install

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "painttest2" -- start
pm2 startup
pm2 save
```

## Digital Ocean MCP Integration

Once deployed, you can set up MCP integration:

1. **Install Digital Ocean MCP** (if available)
2. **Connect to your app** for monitoring and debugging
3. **Access logs and metrics** directly through MCP

## Recommended Next Steps

1. **Start with App Platform** (easier)
2. **Use existing Supabase** database (already set up)
3. **Test deployment**
4. **Set up custom domain** (app.paintquoteapp.com)
5. **Configure MCP integration**

## Benefits of Digital Ocean

- ✅ Full Node.js runtime (no serverless limitations)
- ✅ SQLite will work if needed
- ✅ Better logging and debugging
- ✅ MCP integration available
- ✅ More predictable pricing
- ✅ Easier environment management

## Cost Estimate

- **App Platform**: ~$5-12/month for basic app
- **Droplet**: ~$6/month for basic server
- **Database**: Free with Supabase, or $15/month for DO managed DB

Much more straightforward than Vercel's serverless constraints!