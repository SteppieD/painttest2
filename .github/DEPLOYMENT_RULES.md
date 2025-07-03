# Deployment Rules

## Preventing Deployment Spam

1. **Only deploy from main branch** - Set in vercel.json
2. **Use [skip-deploy] in commits** that don't need deployment
3. **Batch commits** before pushing to reduce deployments
4. **Check deployment count** before large operations

## Safe Commit Practices

```bash
# For documentation changes
git commit -m "docs: Update README [skip-deploy]"

# For work in progress
git commit -m "WIP: Feature development [skip-deploy]"

# For actual deployments
git commit -m "feat: Add new feature"
```

## Check Before Pushing

```bash
# See how many commits will deploy
git log origin/main..HEAD --oneline | grep -v "skip-deploy" | wc -l

# Check current deployment count
vercel ls | grep -c "Production"
```