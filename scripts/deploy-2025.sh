#!/bin/bash

echo "🚀 Deploying LumeraKai Health 2025 - Option 1: Domain Fix"

# Method 1: Simple GitHub Pages deployment
echo "📄 Deploying to GitHub Pages..."

# Copy new landing page to public repo
cp landing-page-2025.html public-deploy/index.html

cd public-deploy

# Ensure we're on main branch
git checkout main

# Add and commit
git add index.html
git commit -m "Deploy LumeraKai Health 2025 - Stroke care and elder abuse prevention focus"

# Push to trigger GitHub Pages
git push origin main

echo "✅ Deployed to GitHub Pages"
echo "🌐 Should be live at: https://kakarath.github.io/lumerakai-health/"

# Method 2: Create simple Netlify deployment
echo ""
echo "📦 Creating Netlify deployment package..."
mkdir -p netlify-deploy
cp landing-page-2025.html netlify-deploy/index.html

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
echo "🌐 Test at: http://localhost:8080/landing-page-2025.html"
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