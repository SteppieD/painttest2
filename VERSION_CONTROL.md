# Version Control Guide - Paint Quote App

## 🏷️ Current Stable Versions

### Latest Stable Release
- **Version**: `v1.0-seo-complete-2025-01-08`
- **Date**: January 8, 2025
- **Branch**: `stable/seo-complete-2025-01-08`
- **Commit**: `945a22a`
- **Description**: Complete SEO implementation with all features working

## 📝 What's Included in v1.0-seo-complete-2025-01-08

### Features
- ✅ All core functionality (quotes, dashboard, admin portal)
- ✅ 6 new SEO-optimized pages
- ✅ Complete sitemap.xml with all pages
- ✅ Professional navigation and footer
- ✅ Case studies and resource pages
- ✅ Paint coverage calculator
- ✅ Invoice template downloads
- ✅ Mobile-responsive design
- ✅ AI-powered quote system with chat memory
- ✅ Contrast fixes for WCAG compliance

### New Pages Added
1. `/paint-coverage-calculator` - Paint calculation tools
2. `/painting-invoice-template` - Invoice templates and downloads
3. `/exterior-painting-quote-calculator` - Specialized exterior quotes
4. `/house-painting-cost-calculator` - Comprehensive cost calculator
5. `/painting-contractor-app` - Mobile app showcase
6. `/case-studies` - Success stories and testimonials

## 🔄 How to Return to Previous Versions

### Method 1: Using Version Tags (Recommended)
```bash
# List all available version tags
git tag -l

# Checkout the stable version
git checkout v1.0-seo-complete-2025-01-08

# To return to the latest code
git checkout main
```

### Method 2: Using Backup Branches
```bash
# List all stable branches
git branch -a | grep stable/

# Checkout the stable branch
git checkout stable/seo-complete-2025-01-08

# To return to main
git checkout main
```

### Method 3: Creating a New Branch from Stable Version
```bash
# Create a new feature branch from the stable version
git checkout -b feature/new-feature v1.0-seo-complete-2025-01-08

# Work on your feature...
# When done, merge back to main
git checkout main
git merge feature/new-feature
```

### Method 4: Emergency Recovery (Use Carefully!)
```bash
# If main branch is completely broken
git checkout main
git reset --hard v1.0-seo-complete-2025-01-08

# Force push to remote (DANGEROUS - will overwrite remote)
git push --force origin main
```

## 🚨 Emergency Recovery Procedures

### If the Production Site is Broken
1. **Immediate Fix**:
   ```bash
   git checkout v1.0-seo-complete-2025-01-08
   vercel --prod
   ```

2. **Then Fix Main Branch**:
   ```bash
   git checkout main
   git reset --hard v1.0-seo-complete-2025-01-08
   # Fix the issue in a new branch
   git checkout -b fix/emergency-fix
   ```

### If Local Development is Broken
```bash
# Stash or discard current changes
git stash  # to save changes
# or
git checkout -- .  # to discard changes

# Return to stable version
git checkout v1.0-seo-complete-2025-01-08
```

### If Database is Corrupted
```bash
# Checkout stable version
git checkout v1.0-seo-complete-2025-01-08

# Delete corrupted database
rm painting_quotes_app.db

# Restart development server (auto-creates fresh DB)
npm run dev
```

## 📋 Version Management Best Practices

### Before Making Major Changes
1. **Create a New Version Tag**:
   ```bash
   git tag -a "v1.1-feature-name-YYYY-MM-DD" -m "Description of changes"
   git push origin --tags
   ```

2. **Create a Backup Branch**:
   ```bash
   git checkout -b stable/feature-name-YYYY-MM-DD
   git push -u origin stable/feature-name-YYYY-MM-DD
   ```

### Version Naming Convention
- **Format**: `v{major}.{minor}-{description}-{YYYY-MM-DD}`
- **Examples**:
  - `v1.0-seo-complete-2025-01-08`
  - `v1.1-payment-integration-2025-01-15`
  - `v2.0-mobile-app-2025-02-01`

### Branch Naming Convention
- **Stable Branches**: `stable/{feature}-{YYYY-MM-DD}`
- **Feature Branches**: `feature/{feature-name}`
- **Fix Branches**: `fix/{issue-description}`
- **Hotfix Branches**: `hotfix/{urgent-fix}`

## 🔍 Checking Version Status

### View Current Version
```bash
# See current branch and commit
git status
git log --oneline -n 1

# See all tags
git tag -l

# See tag details
git show v1.0-seo-complete-2025-01-08
```

### Compare Versions
```bash
# See what changed between versions
git diff v1.0-seo-complete-2025-01-08 main

# See file changes only
git diff --name-only v1.0-seo-complete-2025-01-08 main
```

## 📦 Deployment from Specific Version

### Deploy a Specific Version to Vercel
```bash
# Checkout the version
git checkout v1.0-seo-complete-2025-01-08

# Build and verify
npm run build

# Deploy to production
vercel --prod

# Return to main
git checkout main
```

## 📝 Notes

- Always test builds locally before deploying: `npm run build`
- Keep version tags and branches in sync
- Document major changes in commit messages
- Use semantic versioning for major releases
- Create backups before major refactoring

## 🆘 Quick Reference

**Current Stable Version**: `v1.0-seo-complete-2025-01-08`

**Quick Recovery**:
```bash
git checkout v1.0-seo-complete-2025-01-08
```

**Deploy Stable**:
```bash
git checkout v1.0-seo-complete-2025-01-08 && vercel --prod
```

**Return to Latest**:
```bash
git checkout main
```

---

*Last Updated: January 8, 2025*
*Maintained in: `/VERSION_CONTROL.md` and `/CLAUDE.md`*