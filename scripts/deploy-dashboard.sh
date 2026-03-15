#!/bin/bash

# Deploy LumeraKai Dashboard to app.lumerakai.ai via Cloudflare Pages
echo "🚀 Deploying LumeraKai Dashboard..."

cd "$(dirname "$0")/../web"

npm install
npm run build

npx wrangler pages deploy out --project-name=lumerakai-dashboard

echo "✅ Dashboard deployed to: https://app.lumerakai.ai"
echo "🎯 Investor demo ready!"
