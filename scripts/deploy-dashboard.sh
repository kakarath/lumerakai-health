#!/bin/bash

# Deploy LumeraKai Dashboard to app.lumerakai.ai
# Cloudflare Pages auto-deploys on push to main — this script is for manual triggers
echo "🚀 Deploying LumeraKai Dashboard..."

cd "$(dirname "$0")/.."

git add web/
git diff --cached --quiet && echo "No web changes to deploy." && exit 0

git commit -m "deploy(dashboard): update web app"
git push origin main

echo "✅ Pushed — Cloudflare Pages will build and deploy to https://app.lumerakai.ai"
