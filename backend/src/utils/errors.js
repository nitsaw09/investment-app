class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
      this.statusCode = statusCode;
  }
}

class InternalServerError extends BaseError {
  constructor(message) {
    super(message, 500);
  } 
}

class NotFoundError extends BaseError {
  constructor(message) {
    super(message, 404);
  } 
}

class BadRequestError extends BaseError {
  constructor(message) {
    super(message, 400);
  }
}
  
class UnauthorizedError extends BaseError {
  constructor(message) {
    super(message, 401);
  }
}
  
class ValidationError extends BadRequestError {
  constructor(message) {
    super(message);
  }
}
  
 module.exports = {
  BaseError,
  InternalServerError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ValidationError,
};