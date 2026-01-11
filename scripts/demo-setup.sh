#!/bin/bash

echo "🎪 Setting up LumeraKai Health Demo Environment"

# Function to check if service is running
check_service() {
    local port=$1
    local service=$2
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
        echo "✅ $service is running on port $port"
        return 0
    else
        echo "❌ $service is not responding on port $port"
        return 1
    fi
}

# Start services if not running
echo "🚀 Starting LumeraKai Health services..."

# Start databases
if ! docker ps | grep -q lumerakai-postgres; then
    echo "📊 Starting PostgreSQL..."
    docker run -d --name lumerakai-postgres \
        -e POSTGRES_DB=lumerakai_health \
        -e POSTGRES_USER=lumerakai \
        -e POSTGRES_PASSWORD=secure_password \
        -p 5432:5432 postgres:15
fi

if ! docker ps | grep -q lumerakai-redis; then
    echo "🔴 Starting Redis..."
    docker run -d --name lumerakai-redis -p 6379:6379 redis:7-alpine
fi

# Wait for databases
echo "⏳ Waiting for databases to be ready..."
sleep 5

# Start application services
echo "🎯 Starting application services..."

# API Service
cd api
if [ ! -d "node_modules" ]; then
    echo "📦 Installing API dependencies..."
    npm install
fi
npm start &
API_PID=$!

# Assistant Service  
cd ../assistant
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Assistant dependencies..."
    npm install
fi
npm start &
ASSISTANT_PID=$!

# Web Service
cd ../web
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Web dependencies..."
    npm install
fi
npm run dev &
WEB_PID=$!

cd ..

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 10

# Health checks
echo "🔍 Checking service health..."
check_service 3001 "API Service"
check_service 3002 "Assistant Service" 
check_service 3000 "Web Service"

# Demo readiness check
echo ""
echo "🎪 Demo Environment Status:"
echo "================================"

if check_service 3000 "Web Dashboard"; then
    echo "🌐 Demo URL: http://localhost:3000"
    echo "📊 Agent Dashboard: http://localhost:3000/dashboard"
    echo ""
    echo "✅ Demo environment is ready!"
    echo ""
    echo "🎯 Quick Demo Steps:"
    echo "1. Open http://localhost:3000 in your browser"
    echo "2. Navigate to Agent Dashboard"
    echo "3. Select 'Maria's Scheduling Conflict' scenario"
    echo "4. Watch the agents coordinate in real-time"
    echo ""
    echo "🎤 Demo Script: docs/demo-guide.md"
    echo "🎬 Practice Scenarios:"
    echo "   - Maria's Scheduling Conflict (5 min demo)"
    echo "   - Emergency Room Triage (advanced demo)"
    echo "   - Chronic Care Coordination (clinical demo)"
    echo ""
    echo "🚀 Ready to revolutionize healthcare!"
else
    echo "❌ Demo environment setup failed"
    echo "🔧 Troubleshooting:"
    echo "   - Check if ports 3000, 3001, 3002 are available"
    echo "   - Ensure Docker is running"
    echo "   - Check logs for errors"
fi

# Save PIDs for cleanup
echo $API_PID > .demo_pids
echo $ASSISTANT_PID >> .demo_pids  
echo $WEB_PID >> .demo_pids

echo ""
echo "🛑 To stop demo environment: ./scripts/stop-demo.sh"