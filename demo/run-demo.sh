#!/bin/bash

echo "🌟 LumeraKai Health - Multi-Agent Demo"
echo "Illuminating care through intelligence"
echo "======================================"

# Start services if not running
if ! docker ps | grep -q lumerakai-postgres; then
    echo "📊 Starting PostgreSQL..."
    docker run -d --name lumerakai-postgres -e POSTGRES_DB=lumerakai_health -e POSTGRES_USER=lumerakai -e POSTGRES_PASSWORD=secure_password -p 5432:5432 postgres:15
fi

if ! docker ps | grep -q lumerakai-redis; then
    echo "🔴 Starting Redis..."
    docker run -d --name lumerakai-redis -p 6379:6379 redis:7-alpine
fi

echo "⏳ Waiting for services..."
sleep 3

echo "🚀 Running Maria's Care Coordination Demo..."
echo ""

# Run the demo
cd "$(dirname "$0")/.."
node demo/maria-scenario.js

echo ""
echo "🎯 Demo Scenarios Available:"
echo "  • Maria's scheduling conflict resolution"
echo "  • Multi-agent care coordination"
echo "  • FHIR integration simulation"
echo ""
echo "🔗 Next: View web dashboard at http://localhost:3000"