#!/bin/bash

# This script prevents unnecessary deployments
# Used by Vercel's "Ignored Build Step" setting

echo "Checking if deployment is needed..."

# Only deploy if on main branch
if [[ "$VERCEL_GIT_COMMIT_REF" != "main" ]]; then
  echo "🚫 Not on main branch, skipping deployment"
  exit 0
fi

# Check if this is a merge commit or regular commit
COMMIT_MESSAGE=$(git log -1 --pretty=%B)

# Skip deployment for certain commit messages
if [[ "$COMMIT_MESSAGE" == *"[skip-deploy]"* ]] || [[ "$COMMIT_MESSAGE" == *"[no-deploy]"* ]]; then
  echo "🚫 Commit message contains skip flag, skipping deployment"
  exit 0
fi

# Skip if only documentation changed
git diff HEAD^ HEAD --name-only | grep -qvE '(\.md$|\.txt$|docs/)'
if [ $? -eq 1 ]; then
  echo "🚫 Only documentation files changed, skipping deployment"
  exit 0
fi

echo "✅ Deployment needed"
exit 1