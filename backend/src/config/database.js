const mongoose = require('mongoose');
//const Redis = require('ioredis');
const logger = require('./logger');

class Database {
  constructor() {
    //this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.mongoose = mongoose;
  }

  async connect() {
    try {
      const options = {
        maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) || 100,
        minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE, 10) || 10,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        writeConcern: { w: 'majority' },
        readPreference: 'secondaryPreferred',
      };

      const conn = await this.mongoose.connect(process.env.MONGODB_URI, {});

      if (process.env.NODE_ENV === 'development') {
        this.mongoose.set('debug', true);
      }

      this.setupEventHandlers();
      this.setupGracefulShutdown();

      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      logger.error(`Database connection error: ${error.message}`);
      throw error;
    }
  }

  setupEventHandlers() {
    this.mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    this.mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    this.mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  }

  setupGracefulShutdown() {
    process.on('SIGINT', async () => {
      try {
        await this.mongoose.connection.close();
        //await this.redis.quit();
        logger.info('Database connections closed.');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });
  }
}

const database = new Database();
module.exports = {
  connectDB: () => database.connect(),
  //redis: database.redis,
  mongoose: database.mongoose
};