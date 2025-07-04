# Manual Vercel Deployment Process

## Standard Practice for Production Deployments

This document outlines our standard practice for manual Vercel deployments, ensuring better control over production releases.

## Prerequisites

1. Vercel CLI installed globally:
   ```bash
   npm install -g vercel
   ```

2. Authenticated with Vercel:
   ```bash
   vercel login
   ```

## Deployment Process

### 1. Ensure Clean Git State
```bash
# Check status
git status

# Add and commit any changes
git add .
git commit -m "Your commit message"
git push origin main
```

### 2. Build Locally First (Optional but Recommended)
```bash
# Test the build locally
npm run build

# If successful, proceed to deployment
```

### 3. Deploy to Vercel

#### For Preview Deployment:
```bash
vercel
```

#### For Production Deployment:
```bash
vercel --prod
```

### 4. Monitor Deployment
- The CLI will provide a URL to monitor the deployment progress
- You'll see real-time logs and build status
- Once complete, you'll receive the production URL

## Standard Workflow

1. **Development**: Work on features locally
2. **Testing**: Run `npm run build` to ensure no build errors
3. **Version Control**: Commit and push to GitHub
4. **Preview**: Deploy to preview with `vercel`
5. **Production**: When ready, deploy with `vercel --prod`

## Benefits of Manual Deployment

1. **Control**: Choose exactly when to deploy to production
2. **Testing**: Preview deployments before going live
3. **Rollback**: Easy to revert if issues arise
4. **Monitoring**: Real-time feedback during deployment

## Environment Variables

If you have environment variables in `.env.local`, ensure they're also set in Vercel:

```bash
# Pull existing environment variables
vercel env pull

# Add new variables
vercel env add VARIABLE_NAME
```

## Troubleshooting

### Build Failures
- Check the build logs in the CLI output
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Large Files
- Use `.vercelignore` to exclude unnecessary files
- Consider using CDN for large assets
- Optimize images before deployment (as we did with WebP conversion)

## Quick Reference

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Rollback (promote previous deployment)
vercel rollback [deployment-url]
```

## Notes

- Automatic GitHub deployments are DISABLED for this project
- All production deployments must be done manually via CLI
- This ensures better control and prevents accidental deployments

Last Updated: July 4, 2025