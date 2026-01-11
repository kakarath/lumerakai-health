#!/bin/bash

# Deploy LumeraKai Dashboard to app.lumerakai.ai
echo "🚀 Deploying LumeraKai Dashboard..."

# Build Next.js app
cd web
npm run build
npm run export

# Deploy to Netlify with subdomain
netlify deploy --prod --dir=out --site=app-lumerakai

echo "✅ Dashboard deployed to: https://app.lumerakai.ai"
echo "🎯 Investor demo ready!"