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

# Method 2: Create simple Netlify deployment
echo ""
echo "📦 Creating Netlify deployment package..."
mkdir -p netlify-deploy
cp landing-page-2026.html netlify-deploy/index.html

cat > netlify-deploy/_redirects << 'EOF'
# Redirect all domains to main site
https://lumerakai.com/* https://lumerakai.ai/:splat 301!
https://www.lumerakai.com/* https://lumerakai.ai/:splat 301!
https://www.lumerakai.ai/* https://lumerakai.ai/:splat 301!
EOF

echo "✅ Netlify package ready in netlify-deploy/"
echo "🌐 Drag netlify-deploy folder to https://app.netlify.com/drop"

# Method 3: Test locally
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
echo "1. GitHub Pages: https://kakarath.github.io/lumerakai-health/"
echo "2. Netlify: Drag netlify-deploy/ to https://app.netlify.com/drop"
echo "3. Point lumerakai.ai DNS to working deployment"
echo ""
echo "✅ Option 1 Complete: Professional web presence ready!"