'use strict';

const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;
  const isOperational = statusCode < 500;

  logger.error(
    {
      err: {
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
        name: err.name,
      },
      req: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userId: req.user?.id,
      },
      statusCode,
    },
    isOperational ? 'Client error' : 'Server error'
  );

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({ error: 'Validation failed', details: errors });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ error: `Duplicate value for ${field}` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const message =
    process.env.NODE_ENV === 'production' && statusCode >= 500
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
