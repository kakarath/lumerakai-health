#!/bin/bash

echo "🦙 Setting up Ollama..."

# Start Ollama container if not running
if ! docker ps | grep -q ollama; then
    echo "Starting Ollama container..."
    docker run -d --name lumerakai-ollama -p 11434:11434 -v ollama_data:/root/.ollama ollama/ollama:latest
    sleep 10
fi

# Pull the model
echo "📥 Pulling llama3.1:8b model..."
docker exec lumerakai-ollama ollama pull llama3.1:8b

echo "✅ Ollama setup complete!"
echo "🔗 Ollama API: http://localhost:11434"