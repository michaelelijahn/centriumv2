const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiting');

// CRITICAL: Initialize dependency injection container FIRST, before importing routes
// This ensures container is available when controllers are instantiated during route imports
const container = require('./src/container');

// Import routes AFTER container is initialized
const authRoutes = require('./routes/auth');
const bankRoutes = require('./routes/bank');
const supportRoutes = require('./routes/support');
const adminRoutes = require('./routes/admin');
const tradingRoutes = require('./routes/trading');

const app = express();

// Security headers middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      childSrc: ["'self'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'"],
      manifestSrc: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for development
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// General rate limiting for all routes
app.use(generalLimiter);

// Updated CORS configuration to accept requests from localhost during development
app.use(cors({
  origin: ['http://localhost:5173', 'https://crm.centrium.id'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Apply JSON parsing to routes that need it (excluding file upload routes)
app.use('/auth', express.json(), authRoutes);
app.use('/bank', express.json(), bankRoutes);
app.use('/support', express.json(), supportRoutes);
app.use('/admin', express.json(), adminRoutes);

// Trading routes need special handling - apply JSON parsing selectively
app.use('/trading', tradingRoutes);

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const health = await container.healthCheck();
        const statusCode = health.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

// Container info endpoint (for debugging)
app.get('/container/info', (req, res) => {
    const available = container.getAvailable();
    res.json({
        success: true,
        data: available
    });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('New Service-Oriented Architecture initialized successfully');
});

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
    
    server.close(async () => {
        try {
            console.log('HTTP server closed');
            await container.shutdown();
            console.log('Graceful shutdown completed');
            process.exit(0);
        } catch (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));