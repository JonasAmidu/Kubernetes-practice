const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
});

// Service URLs from environment variables
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';

// Proxy middleware options
const userProxyOptions = {
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/'
  },
  onError: (err, req, res) => {
    console.error('User service proxy error:', err.message);
    res.status(503).json({ 
      error: 'User service unavailable',
      message: err.message 
    });
  }
};

const productProxyOptions = {
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/'
  },
  onError: (err, req, res) => {
    console.error('Product service proxy error:', err.message);
    res.status(503).json({ 
      error: 'Product service unavailable',
      message: err.message 
    });
  }
};

// Routes
app.use('/api/users', createProxyMiddleware(userProxyOptions));
app.use('/api/products', createProxyMiddleware(productProxyOptions));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown handling
const server = app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
