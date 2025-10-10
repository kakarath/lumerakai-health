#!/bin/bash

echo "🚀 Deploying LumeraKai Health Landing Page"

# Option 1: Deploy to GitHub Pages
deploy_github_pages() {
    echo "📄 Deploying to GitHub Pages..."
    
    cd public-deploy
    
    # Create gh-pages branch
    git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
    
    # Copy landing page
    cp ../landing-page/index.html .
    cp -r ../landing-page/assets . 2>/dev/null || true
    
    # Create CNAME for custom domain
    echo "www.lumerakai.ai" > CNAME
    
    # Commit and push
    git add .
    git commit -m "Deploy LumeraKai Health landing page"
    git push origin gh-pages
    
    echo "✅ Deployed to GitHub Pages"
    echo "🔗 Enable Pages in repo settings: https://github.com/kakarath/lumerakai-health/settings/pages"
}

# Option 2: Deploy to Cloudflare Pages
deploy_cloudflare_pages() {
    echo "☁️ Preparing for Cloudflare Pages deployment..."
    
    # Create deployment directory
    mkdir -p cloudflare-deploy
    cp landing-page/index.html cloudflare-deploy/
    cp -r landing-page/assets cloudflare-deploy/ 2>/dev/null || true
    
    echo "✅ Files ready for Cloudflare Pages"
    echo "🔗 Connect repo at: https://dash.cloudflare.com/pages"
    echo "📁 Build output directory: /"
    echo "🏗️ Build command: (none needed)"
}

# Option 3: Generate deployment package
create_deployment_package() {
    echo "📦 Creating deployment package..."
    
    mkdir -p deployment-package
    cp landing-page/index.html deployment-package/
    cp -r landing-page/assets deployment-package/ 2>/dev/null || true
    
    # Create simple server for testing
    cat > deployment-package/server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Handle all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌐 LumeraKai Health running on port ${PORT}`);
    console.log(`🔗 Visit: http://localhost:${PORT}`);
});
EOF

    cat > deployment-package/package.json << 'EOF'
{
  "name": "lumerakai-landing",
  "version": "1.0.0",
  "description": "LumeraKai Health Landing Page",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

    echo "✅ Deployment package created"
    echo "📁 Directory: deployment-package/"
    echo "🚀 Test locally: cd deployment-package && npm install && npm start"
}

# Main deployment options
echo "Choose deployment option:"
echo "1) GitHub Pages (recommended for demo)"
echo "2) Cloudflare Pages (recommended for production)"  
echo "3) Create deployment package"
echo "4) All options"

read -p "Enter choice (1-4): " choice

case $choice in
    1) deploy_github_pages ;;
    2) deploy_cloudflare_pages ;;
    3) create_deployment_package ;;
    4) 
        deploy_github_pages
        deploy_cloudflare_pages  
        create_deployment_package
        ;;
    *) echo "Invalid choice" ;;
esac

echo ""
echo "🎯 Next Steps:"
echo "1. Configure Cloudflare DNS (see docs/domain-configuration.md)"
echo "2. Set up page rules for redirects"
echo "3. Enable SSL/TLS Full (strict)"
echo "4. Test all domain variations"
echo ""
echo "🌐 Final URL: https://www.lumerakai.ai"