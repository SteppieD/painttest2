# Install Digital Ocean MCP for Claude Code

## Step 1: Install the Digital Ocean MCP

```bash
# Clone the repository
git clone https://github.com/digitalocean/digitalocean-mcp.git
cd digitalocean-mcp

# Install dependencies
npm install

# Build the MCP server
npm run build
```

## Step 2: Get Digital Ocean API Token

1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Click "Generate New Token"
3. Name: "Claude Code MCP"
4. Scopes: Select "Read" and "Write"
5. Copy the token (save it securely)

## Step 3: Configure Claude Code with Digital Ocean MCP

```bash
# Add the MCP to Claude Code
claude mcp add digitalocean /path/to/digitalocean-mcp --env DIGITALOCEAN_API_TOKEN=your_token_here
```

Or manually configure in your Claude Code settings with:
- Server path: `/path/to/digitalocean-mcp`
- Environment variables: `DIGITALOCEAN_API_TOKEN=your_api_token`

## Step 4: Restart Claude Code

Restart Claude Code to load the new MCP tools.

## Step 5: Verify Installation

In your next Claude Code session, I should have access to Digital Ocean tools like:
- `do_list_droplets`
- `do_get_droplet`
- `do_create_droplet`
- `do_list_databases`
- And more...

## What This Enables

Once installed, I'll be able to:
- ✅ Monitor your droplet status
- ✅ Help deploy your app directly
- ✅ Check logs and performance
- ✅ Manage domains and DNS
- ✅ Debug issues in real-time
- ✅ Scale resources as needed

This will make deployment and troubleshooting much easier!

## For Now

While you install the MCP, let's continue with manual deployment. Once the MCP is set up, future deployments will be much smoother.