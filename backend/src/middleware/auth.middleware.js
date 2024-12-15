const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { UnauthorizedError } = require('../utils/errors');

const authHandler = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedError('Not authorized, token failed');
    }
  }

  if (!token) {
    throw new UnauthorizedError('Not authorized, no token');
  }
});

module.exports = { authHandler };