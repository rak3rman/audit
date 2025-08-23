require('dotenv').config();
const express = require('express');
const cors = require('cors');
const agentRoutes = require('./routes/agentRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Audit Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/agent', agentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Audit Backend Server running on port ${PORT}`);
  console.log(`📞 VAPI Agent endpoints available at /api/agent/*`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 