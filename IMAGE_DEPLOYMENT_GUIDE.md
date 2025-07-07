# Professional Images Deployment Guide

## Overview
The professional photography assets (25 high-quality images) are not committed to Git due to their large size (37MB total). Here's how to handle them for deployment.

## Image Files Location
The images are located at: `/Users/sepg/Desktop/Paint Images/`

## Option 1: Manual Upload to Vercel (Recommended)
1. Deploy the code first (already done)
2. In Vercel Dashboard:
   - Go to your project
   - Navigate to the "Files" tab
   - Upload images to `/public/images/professional/`

## Option 2: Use a CDN (Best for Production)
1. Upload images to a CDN service:
   - Cloudinary (free tier available)
   - AWS S3 + CloudFront
   - Vercel Blob Storage
   - Uploadcare

2. Update `lib/image-config.ts` to use CDN URLs:
```typescript
export const professionalImages = {
  hero: {
    main: 'https://your-cdn.com/man-painting-wall-light-blue.jpg',
    // ... update all URLs
  }
}
```

## Option 3: Image Optimization Before Upload
1. Optimize images using:
   - `sharp` CLI tool
   - ImageOptim app
   - TinyPNG.com

2. Commands to optimize:
```bash
# Install sharp-cli
npm install -g sharp-cli

# Optimize all images (reduce to 80% quality, max 1920px width)
for img in *.jpg; do
  sharp "$img" -q 80 -w 1920 -o "optimized-$img"
done
```

## Option 4: Git LFS (Large File Storage)
1. Install Git LFS:
```bash
git lfs install
```

2. Track image files:
```bash
git lfs track "public/images/professional/*.jpg"
git add .gitattributes
```

3. Add and commit images:
```bash
git add public/images/professional/*
git commit -m "Add professional images via Git LFS"
git push
```

## Current Implementation
- Code is deployed and ready
- Image configuration system in place
- Components reference local image paths
- Images work perfectly in development

## Quick Fix for Production
For immediate production deployment without images:
1. The site will still work (Next.js handles missing images gracefully)
2. Add placeholder images to `public/images/professional/` with same filenames
3. Or update `lib/image-config.ts` to use placeholder service URLs

## Recommended Approach
1. Optimize images to reduce size (target: <100KB per image)
2. Use Vercel Blob Storage or Cloudinary for hosting
3. Update image URLs in configuration
4. Benefit: Faster page loads, better SEO, no Git issues