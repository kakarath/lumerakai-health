#!/bin/bash

echo "🚀 Quick Deploy to Fix Website Issues"

# Create a simple index.html in the root for immediate deployment
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LumeraKai Health - Coming Soon</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 2rem;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .cta {
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .cta:hover {
            background: white;
            color: #667eea;
        }
        .status {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>LumeraKai Health</h1>
        <p><em>Illuminating care through intelligence</em></p>
        <p>AI that listens so doctors can heal</p>
        <a href="https://github.com/kakarath/lumerakai-health" class="cta">View Demo on GitHub</a>
        <div class="status">
            ✅ Website is now working!<br>
            🚀 Full landing page coming soon
        </div>
    </div>
</body>
</html>
EOF

# Commit and push to trigger deployment
git add index.html
git commit -m "Quick fix: Add temporary landing page"
git push origin main

echo "✅ Temporary landing page deployed!"
echo "🌐 Your website should now work at:"
echo "   - https://lumerakai.ai"
echo "   - https://lumerakai.com"
echo ""
echo "🔄 Next steps:"
echo "1. Set up Cloudflare Pages (see docs/cloudflare-pages-fix.md)"
echo "2. Replace with full landing page from landing-page/index.html"