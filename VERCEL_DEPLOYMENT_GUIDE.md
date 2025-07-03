# Vercel Deployment Guide for Private Repository

Based on official Vercel documentation and our current setup.

## Current Issues & Solutions

### 1. Private Repository Deployment Issues
**Problem**: Deployments not triggering from private repo
**Causes**:
- Git commit author must have Collaborator access to the repository
- Vercel requires webhook configuration permissions
- Email privacy settings blocking pushes

### 2. Deployment Limit Issues
**Problem**: Hit 100 deployments/day limit on Hobby plan
**Solution**: Configure to only deploy main branch and skip unnecessary builds

## Configuration Steps

### Step 1: Fix GitHub Email Privacy
```bash
# Use GitHub's noreply email to avoid privacy blocks
git config user.email "122101575+SteppieD@users.noreply.github.com"
```

### Step 2: Vercel Project Settings
In Vercel Dashboard → Project Settings → Git:

1. **Connected Git Repository**:
   - ✅ Keep connected to `SteppieD/painttest2`
   - ❌ Uncheck "Pull Request Comments" (reduces deployments)
   - ❌ Uncheck "Commit Comments" (reduces deployments)
   - ✅ Keep "deployment_status Events" checked

2. **Ignored Build Step**:
   - Select "Only build when command passes"
   - Command: `bash scripts/should-deploy.sh`

### Step 3: Configure vercel.json
```json
{
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  },
  "github": {
    "enabled": true,
    "autoAlias": false,
    "silent": true,
    "autoJobCancellation": true
  }
}
```

### Step 4: Deploy Hook for Manual Triggers
Your deploy hook URL:
```
https://api.vercel.com/v1/integrations/deploy/prj_kr3rZvlvsIPUl3jF52bpTErghrrK/2kFymWIeTC
```

Manual trigger:
```bash
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_kr3rZvlvsIPUl3jF52bpTErghrrK/2kFymWIeTC"
```

## Environment Variables Available

These are automatically available in your deployments:
- `VERCEL_GIT_PROVIDER` - Always "github"
- `VERCEL_GIT_REPO_SLUG` - "painttest2"
- `VERCEL_GIT_REPO_OWNER` - "SteppieD"
- `VERCEL_GIT_COMMIT_REF` - Branch name (e.g., "main")
- `VERCEL_GIT_COMMIT_SHA` - Commit hash
- `VERCEL_GIT_COMMIT_MESSAGE` - Commit message
- `VERCEL_GIT_COMMIT_AUTHOR_LOGIN` - GitHub username
- `VERCEL_GIT_COMMIT_AUTHOR_NAME` - Committer name

## Skip Deployment Patterns

Add to commit messages to skip deployment:
- `[skip-deploy]` - Skip this deployment
- `[no-deploy]` - Skip this deployment

Example:
```bash
git commit -m "Update README [skip-deploy]"
```

## Deployment Limits

### Hobby Plan:
- 100 deployments per day
- Resets at midnight UTC (5 PM PST)

### To Reduce Deployments:
1. Only deploy main branch
2. Use ignored build step script
3. Disable PR/commit comments
4. Use skip flags for docs-only changes

## Troubleshooting

### "Git author must have access to project"
- Ensure your GitHub email is verified
- Make sure you have Collaborator access to the repo
- Check Vercel team membership (if on team plan)

### "Resource is limited"
- You've hit the 100/day limit
- Wait for reset at 5 PM PST
- Or upgrade to Pro plan

### Deployments not triggering
1. Check GitHub webhook status
2. Verify Git integration in Vercel
3. Ensure correct branch configuration
4. Check ignored build step script

## Best Practices

1. **Use semantic commit messages**:
   ```
   feat: Add new feature
   fix: Fix bug in component
   docs: Update README [skip-deploy]
   chore: Update dependencies
   ```

2. **Branch strategy**:
   - `main` - Production deployments
   - Feature branches - No automatic deployments

3. **Environment variables**:
   - Set in Vercel dashboard, not in code
   - Use different values for preview/production

4. **Monitor usage**:
   - Check https://vercel.com/account/usage regularly
   - Set up alerts for deployment failures