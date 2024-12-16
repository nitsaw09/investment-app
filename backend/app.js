require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { connectDB } = require('./src/config/database');
const authRoutes = require('./src/modules/auth/auth.routes');
const cryptoRoutes = require('./src/modules/crypto/crypto.routes');
const portfolioRoutes = require('./src/modules/portfolio/portfolio.routes');
const errorHandler = require('./src/middleware/error.middleware');
const logger = require('./src/config/logger');
const { NotFoundError } = require('./src/utils/errors');

const app = express();

// Security Headers using Helmet
app.use(helmet());

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests, please try again later.',
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' })); 
app.use(globalLimiter); 

// Version 1 API Routes with specific rate limits
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/crypto', cryptoRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);

app.use((req, res, next) => {
  const error = new NotFoundError('Route not found');
  next(error);
});

// Error Handler
app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;