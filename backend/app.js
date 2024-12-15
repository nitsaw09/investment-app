require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database');
const authRoutes = require('./src/modules/auth/auth.routes');
const cryptoRoutes = require('./src/modules/crypto/crypto.routes');
const portfolioRoutes = require('./src/modules/portfolio/portfolio.routes');
const errorHandler = require('./src/middleware/error.middleware');
const logger = require('./src/config/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Version 1 API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/crypto', cryptoRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);

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