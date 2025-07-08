# 🚀 VERCEL DEPLOYMENT WORKFLOW

## ⚠️ CRITICAL: ALWAYS PUSH TO GIT BEFORE TESTING

This project uses **Vercel auto-deployment** from git. Changes only appear on the live site after `git push`.

## 📋 Required Commands After Every Code Change

```bash
# 1. Build and verify no errors
npm run build

# 2. Commit all changes to git
git add -A
git commit -m "Describe your changes here"

# 3. REQUIRED - Push to git (triggers Vercel deployment)
git push

# 4. Wait 1-2 minutes for Vercel to deploy
# 5. Test on live Vercel URL
```

## ❌ What NOT to Do
- ❌ Don't test changes without `git push`
- ❌ Don't run `npm run dev` for testing (use live site)
- ❌ Don't assume changes work until pushed and tested on Vercel

## ✅ Correct Workflow
1. **Make code changes**
2. **Build locally** (`npm run build`)
3. **Commit to git** (`git add -A && git commit -m "..."`)
4. **Push to git** (`git push`) - **THIS IS MANDATORY**
5. **Wait for Vercel deployment** (1-2 minutes)
6. **Test on live Vercel URL**

## 🔄 Why This Matters
- Vercel deploys automatically when git receives new commits
- Local changes are NOT visible on Vercel until pushed to git
- The live site is the only reliable testing environment
- All users access the Vercel-deployed version

## 🎯 Quick Reference
**After any file edit:**
```bash
npm run build && git add -A && git commit -m "Fix X issue" && git push
```

**Then test on the live Vercel URL after deployment completes.**