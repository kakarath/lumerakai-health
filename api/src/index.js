const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { sequelize } = require('./models');
const conversationRoutes = require('./routes/conversation');
const patientsRoutes = require('./routes/patients');
const conversationsRoutes = require('./routes/conversations');
const fhirRoutes = require('./routes/fhir');
const schedulingRoutes = require('./routes/scheduling');
const insightsRoutes = require('./routes/insights');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'lumerakai-api', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/patients', patientsRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/fhir', fhirRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/insights', insightsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database sync and server start
const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };
sequelize.sync(syncOptions).then(() => {
  console.log('📊 Database synced');
  app.listen(PORT, () => {
    console.log(`🚀 LumeraKai API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}).catch(err => {
  console.error('❌ Database sync failed:', err);
});