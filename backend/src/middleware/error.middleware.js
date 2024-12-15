const logger = require('../config/logger');
const { BaseError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;