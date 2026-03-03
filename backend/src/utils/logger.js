'use strict';

const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
      : undefined,
  redact: {
    paths: ['req.headers.authorization', 'body.password', 'body.refreshToken'],
    censor: '[REDACTED]',
  },
  base: { service: 'phu-ai-backend', env: process.env.NODE_ENV },
});

module.exports = logger;
