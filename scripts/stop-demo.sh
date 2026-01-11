#!/bin/bash

echo "🛑 Stopping LumeraKai Health Demo Environment"

# Stop application services
if [ -f ".demo_pids" ]; then
    echo "🔄 Stopping application services..."
    while read pid; do
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            echo "✅ Stopped process $pid"
        fi
    done < .demo_pids
    rm .demo_pids
fi

# Stop Docker containers
echo "🐳 Stopping Docker containers..."
docker stop lumerakai-postgres lumerakai-redis 2>/dev/null || true
docker rm lumerakai-postgres lumerakai-redis 2>/dev/null || true

echo "✅ Demo environment stopped"
echo "🚀 To restart: ./scripts/demo-setup.sh"