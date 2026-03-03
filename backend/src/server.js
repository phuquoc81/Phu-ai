'use strict';

require('dotenv').config();

const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

let server;

async function start() {
  await connectDB();

  server = http.createServer(app);

  server.listen(PORT, () => {
    logger.info({ port: PORT, env: process.env.NODE_ENV }, 'Server started');
  });

  server.on('error', (err) => {
    logger.error({ err }, 'Server error');
    process.exit(1);
  });
}

function gracefulShutdown(signal) {
  logger.info({ signal }, 'Shutdown signal received');
  server.close((err) => {
    if (err) {
      logger.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
    const mongoose = require('mongoose');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.warn('Forcing shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
  process.exit(1);
});

start();
