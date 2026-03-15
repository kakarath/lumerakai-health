#!/bin/bash

echo "🚀 Deploying LumeraKai Health 2026 - Option 1: Domain Fix"

# Method 1: Simple GitHub Pages deployment
echo "📄 Deploying to GitHub Pages..."

# Copy new landing page to public repo (root + landing-page/ for Cloudflare Pages)
cp landing-page-2026.html public-deploy/index.html
cp landing-page-2026.html public-deploy/landing-page/index.html

cd public-deploy

# Deploy to main
git checkout main
git add index.html landing-page/index.html
git commit -m "Deploy LumeraKai Health 2026 - Stroke care and elder abuse prevention focus"
git push origin main

# Deploy to gh-pages (serves lumerakai.ai via GitHub Pages + Cloudflare)
git checkout gh-pages
git add index.html landing-page/index.html
git commit -m "Deploy LumeraKai Health 2026 - Stroke care and elder abuse prevention focus"
git push origin gh-pages

git checkout main

echo "✅ Deployed to main and gh-pages"
echo "🌐 Live at: https://lumerakai.ai"

# Method 2: Test locally
echo ""
echo "🔍 Testing locally..."
cd ..
python3 -m http.server 8080 --directory . &
SERVER_PID=$!
sleep 2

echo "✅ Local test server running"
echo "🌐 Test at: http://localhost:8080/landing-page-2026.html"
echo ""
echo "🛑 Press Ctrl+C to stop local server"

# Wait for user to test
read -p "Press Enter after testing to stop local server..."
kill $SERVER_PID

echo ""
echo "🎯 Next Steps:"
echo "1. Landing page: https://lumerakai.ai"
echo "2. Dashboard: run ./scripts/deploy-dashboard.sh"
echo ""
echo "✅ Deploy complete!"