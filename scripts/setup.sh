#!/bin/bash

echo "🚀 Setting up LumeraKai Health Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# API Keys (replace with your actual keys)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Database
DATABASE_URL=postgresql://lumerakai:secure_password@postgres:5432/lumerakai_health
REDIS_URL=redis://redis:6379

# FHIR Server
FHIR_SERVER_URL=http://fhir-server:8080/fhir

# Environment
NODE_ENV=development
EOF
    echo "⚠️  Please update .env with your actual API keys"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install dependencies for each service
echo "📦 Installing API dependencies..."
cd api && npm install && cd ..

echo "📦 Installing Web dependencies..."
cd web && npm install && cd ..

echo "📦 Installing Assistant dependencies..."
cd assistant && npm install && cd ..

# Create database initialization script
echo "🗄️  Creating database initialization script..."
cat > scripts/init-db.sql << EOF
-- Create additional database for HAPI FHIR
CREATE DATABASE hapi_fhir;
CREATE USER hapi WITH PASSWORD 'hapi_password';
GRANT ALL PRIVILEGES ON DATABASE hapi_fhir TO hapi;

-- Create tables for LumeraKai
\c lumerakai_health;

CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    transcript TEXT NOT NULL,
    analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_alerts (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scheduling_optimizations (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    original_date DATE,
    optimized_date DATE,
    reason TEXT,
    applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your API keys"
echo "2. Run: docker-compose up -d"
echo "3. Visit: http://localhost:3000"
echo ""
echo "Services will be available at:"
echo "- Web App: http://localhost:3000"
echo "- API: http://localhost:3001"
echo "- Assistant: http://localhost:3002"
echo "- FHIR Server: http://localhost:8080"