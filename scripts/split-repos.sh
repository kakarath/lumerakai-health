#!/bin/bash

echo "🔄 Splitting LumeraKai Health into public and private repositories..."

# Create public demo repository structure
mkdir -p public-repo/{demo,docs,web,api-basic,scripts}

# PUBLIC REPO - Demo and basic components
echo "📁 Preparing public repository..."

# Copy public-safe files
cp README-public.md public-repo/README.md
cp .env.example public-repo/
cp .gitignore public-repo/
cp SECURITY.md public-repo/
cp LICENSE public-repo/
cp docker-compose.yml public-repo/

# Copy documentation
cp -r docs public-repo/
cp -r demo public-repo/

# Copy basic web components (no proprietary logic)
cp -r web/src/components public-repo/web/
cp -r web/src/hooks public-repo/web/
cp web/package.json public-repo/web/
cp web/next.config.js public-repo/web/
cp web/tailwind.config.js public-repo/web/

# Copy basic API structure (no proprietary agents)
cp -r api/src/models public-repo/api-basic/
cp -r api/src/routes public-repo/api-basic/
cp api/package.json public-repo/api-basic/
cp api/Dockerfile public-repo/api-basic/

# Copy setup scripts
cp scripts/setup.sh public-repo/scripts/
cp scripts/seed-data.js public-repo/scripts/
cp start-dev.sh public-repo/

# Create private core repository structure
mkdir -p private-repo/{agents,security,analytics,integrations}

# PRIVATE REPO - Proprietary IP and enterprise features
echo "🔒 Preparing private repository..."

# Move proprietary components
cp -r agents/src private-repo/agents/
cp -r security private-repo/
cp -r assistant/src/services private-repo/agents/ai-services/
cp -r connect private-repo/integrations/

# Create private README
cat > private-repo/README.md << 'EOF'
# LumeraKai Health - Private Core
*Proprietary AI agents and enterprise features*

## 🔒 Confidential
This repository contains proprietary intellectual property including:
- Advanced AI agent orchestration
- Specialized healthcare agents (Lumera-Doc, Lumera-Nurse, etc.)
- PIQI analytics engine
- Enterprise security implementations
- Production FHIR integrations

## 🚫 Access Restricted
- Authorized personnel only
- All code is proprietary and confidential
- Do not share or distribute without authorization

## 🛡️ Security
- All commits must be signed
- Regular security audits required
- HIPAA compliance mandatory
EOF

# Create deployment scripts
cat > init-public.sh << 'EOF'
#!/bin/bash
cd public-repo
git init
git remote add origin https://github.com/kakarath/lumerakai-health.git
git add .
git commit -m "Initial LumeraKai Health public demo"
git branch -M main
git push -u origin main
EOF

cat > init-private.sh << 'EOF'
#!/bin/bash
cd private-repo
git init
git remote add origin https://github.com/kakarath/lumerakai-health-private.git
git add .
git commit -m "Initial LumeraKai Health private core"
git branch -M main
git push -u origin main
EOF

chmod +x init-public.sh init-private.sh

echo "✅ Repository split completed!"
echo "📁 public-repo/ - Ready for https://github.com/kakarath/lumerakai-health"
echo "🔒 private-repo/ - Ready for https://github.com/kakarath/lumerakai-health-private"
echo ""
echo "🚀 Next steps:"
echo "  1. Run ./init-public.sh to deploy public demo"
echo "  2. Run ./init-private.sh to deploy private core"