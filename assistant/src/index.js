const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const AIRouter = require('./services/aiRouter');
const { LumeraOrchestrator } = require('../../agents/src/lumeraAgents');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3002;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'lumerakai-assistant' });
});

// Initialize services
const aiRouter = new AIRouter();
const lumeraOrchestrator = new LumeraOrchestrator(aiRouter);

// Socket.IO for real-time conversation handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle conversation input
  socket.on('conversation:input', async (data) => {
    try {
      const { transcript, speaker, context } = data;
      
      // Process with LumeraKai Multi-Agent System
      const analysis = await lumeraOrchestrator.processPatientMessage(transcript, context);
      
      // Generate response if needed
      if (analysis.urgencyLevel === 'high') {
        socket.emit('conversation:alert', { urgency: 'high', message: analysis.suggestedFollowUp });
      }

      // Send analysis back
      socket.emit('conversation:analysis', analysis);
    } catch (error) {
      socket.emit('conversation:error', { error: error.message });
    }
  });

  // Handle voice input
  socket.on('voice:input', async (audioData) => {
    try {
      // Process voice to text (placeholder - would integrate with speech-to-text service)
      const transcript = 'Voice processing not implemented yet';
      socket.emit('voice:transcript', { transcript });
    } catch (error) {
      socket.emit('voice:error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🤖 LumeraKai Assistant running on port ${PORT}`);
});