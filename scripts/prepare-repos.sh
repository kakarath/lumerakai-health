#!/bin/bash

echo "🔐 Preparing repositories for public and private deployment..."

# Create public demo structure
mkdir -p public-demo/{demo,docs,examples,ui}

# Copy public-safe files to demo structure
cp README-public.md public-demo/README.md
cp -r web/src/components public-demo/ui/
cp -r docs public-demo/
cp .env.example public-demo/

# Create demo-specific files
cat > public-demo/demo/conversation-demo.js << 'EOF'
// Demo conversation analysis - no real PHI
const demoConversation = {
  transcript: "Patient: I've been having some discomfort. Doctor: Can you describe it? Family: They mentioned it yesterday too.",
  participants: ['patient', 'doctor', 'family'],
  analysis: {
    summary: "Patient reporting discomfort, family confirms timeline",
    urgencyLevel: "medium",
    actionItems: ["Schedule follow-up", "Document symptoms"]
  }
};

module.exports = demoConversation;
EOF

# Create private repo structure
mkdir -p private-core/{agents/proprietary,analytics/piqi,security/enterprise}

# Move proprietary components
mv agents/src/specializedAgents.js private-core/agents/proprietary/
mv security/hipaa-compliance.js private-core/security/enterprise/

# Create git initialization scripts
cat > init-public-repo.sh << 'EOF'
#!/bin/bash
cd public-demo
git init
git remote add origin https://github.com/kakarath/lumerakai-health.git
git add .
git commit -m "Initial public demo release"
git push -u origin main
EOF

cat > init-private-repo.sh << 'EOF'
#!/bin/bash
cd private-core
git init
git remote add origin https://github.com/kakarath/lumerakai-health-private.git
git add .
git commit -m "Initial private core release"
git push -u origin main
EOF

chmod +x init-public-repo.sh init-private-repo.sh

echo "✅ Repository structure prepared!"
echo "📁 public-demo/ - Ready for public GitHub"
echo "🔒 private-core/ - Ready for private GitHub"
echo "🚀 Run ./init-public-repo.sh and ./init-private-repo.sh to deploy"