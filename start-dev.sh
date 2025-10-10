#!/bin/bash

echo "🚀 Starting LumeraKai Health Development Environment"

# Update environment for local development
export DATABASE_URL="postgresql://lumerakai:secure_password@localhost:5432/lumerakai_health"
export REDIS_URL="redis://localhost:6379"
export FHIR_SERVER_URL="http://localhost:8080/fhir"
export NODE_ENV="development"

# Check if containers are running
if ! docker ps | grep -q lumerakai-postgres; then
    echo "📊 Starting PostgreSQL..."
    docker run -d --name lumerakai-postgres -e POSTGRES_DB=lumerakai_health -e POSTGRES_USER=lumerakai -e POSTGRES_PASSWORD=secure_password -p 5432:5432 postgres:15
fi

if ! docker ps | grep -q lumerakai-redis; then
    echo "🔴 Starting Redis..."
    docker run -d --name lumerakai-redis -p 6379:6379 redis:7-alpine
fi

if ! docker ps | grep -q lumerakai-ollama; then
    echo "🦙 Starting Ollama..."
    docker run -d --name lumerakai-ollama -p 11434:11434 -v ollama_data:/root/.ollama ollama/ollama:latest
    sleep 5
    echo "📥 Pulling llama3.1:8b model..."
    docker exec lumerakai-ollama ollama pull llama3.1:8b
fi

echo "⏳ Waiting for services to be ready..."
sleep 5

echo "📦 Installing dependencies..."
cd api && npm install &
cd ../assistant && npm install &
cd ../connect && npm install &
cd ../web && npm install &
wait

echo "🎯 Starting services..."
cd ../api && npm start &
cd ../assistant && npm start &
cd ../connect && npm start &
cd ../web && npm run dev &

echo "✅ LumeraKai Health is starting up!"
echo "🌐 Web UI: http://localhost:3000"
echo "🔌 API: http://localhost:3001"
echo "🤖 Assistant: http://localhost:3002"
echo "🔗 Connect: http://localhost:3003"
echo "🦙 Ollama: http://localhost:11434"
echo ""
echo "🔄 AI Load Balancing: Google Gemini ↔ Mistral ↔ Ollama"
echo "⚠️  Google: 28-day limit, Mistral: Free tier, Ollama: Unlimited local"
echo "📝 Triple rotation to maximize free usage across all providers"

wait