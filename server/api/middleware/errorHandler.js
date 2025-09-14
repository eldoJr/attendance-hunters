const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(error('Validation failed', 400, err.errors));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(error('Invalid token', 401));
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(error('Token expired', 401));
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json(error('Resource already exists', 409));
  }

  if (err.code === 'P2025') {
    return res.status(404).json(error('Resource not found', 404));
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json(error(message, statusCode));
};

module.exports = errorHandler;