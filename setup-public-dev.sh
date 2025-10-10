#!/bin/bash

echo "🚀 Setting up LumeraKai Health public development environment"

# Clone the public repository for development
if [ ! -d "lumerakai-public-dev" ]; then
    git clone https://github.com/kakarath/lumerakai-health.git lumerakai-public-dev
    cd lumerakai-public-dev
else
    cd lumerakai-public-dev
    git pull origin main
fi

# Copy environment template
cp .env.example .env
echo "📝 Please add your API keys to .env file"

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    npm install
fi

echo "✅ Public development environment ready!"
echo "📁 Directory: lumerakai-public-dev/"
echo "🌐 Repository: https://github.com/kakarath/lumerakai-health"
echo ""
echo "Next steps:"
echo "1. cd lumerakai-public-dev"
echo "2. Add your API keys to .env"
echo "3. Run ./demo/run-demo.sh"