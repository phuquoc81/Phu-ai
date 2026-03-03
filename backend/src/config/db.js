'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5_000;

async function connectDB(retries = MAX_RETRIES) {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in environment');

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5_000,
    });
    logger.info('MongoDB connected');
  } catch (err) {
    if (retries > 0) {
      logger.warn({ retriesLeft: retries - 1 }, 'MongoDB connection failed, retrying...');
      await new Promise((res) => setTimeout(res, RETRY_INTERVAL_MS));
      return connectDB(retries - 1);
    }
    logger.error({ err }, 'MongoDB connection exhausted all retries');
    throw err;
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error({ err }, 'MongoDB error');
  });
}

module.exports = { connectDB };
