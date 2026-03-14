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

// CSRF protection — enforce custom header on all state-changing requests.
// Bearer token APIs are CSRF-safe when browsers cannot set custom headers
// cross-origin (CORS blocks it). This middleware makes that guarantee explicit.
function csrfProtection(req, res, next) {
  const stateMutating = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (stateMutating.includes(req.method)) {
    const hasBearer = /^Bearer /i.test(req.headers.authorization || '');
    const hasCustomHeader = req.headers['x-requested-with'] === 'XMLHttpRequest';
    if (!hasBearer && !hasCustomHeader) {
      return res.status(403).json({ error: 'CSRF check failed' });
    }
  }
  next();
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:']
    }
  }
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(csrfProtection);

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