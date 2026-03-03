'use strict';

const mongoose = require('mongoose');

/**
 * Paginate a Mongoose query.
 * @param {import('mongoose').Query} queryObj - The Mongoose query to execute
 * @param {import('mongoose').Model} model - The Mongoose model for count
 * @param {object} filter - The filter used for countDocuments
 * @param {object} [options]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=20]
 * @param {object} [options.sort]
 * @returns {Promise<{data: any[], pagination: object}>}
 */
async function paginate(query, model, filter, { page = 1, limit = 20, sort = { createdAt: -1 } } = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    query.sort(sort).skip(skip).limit(Number(limit)),
    model.countDocuments(filter),
  ]);
  return {
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

/**
 * Sanitize a user object by removing sensitive fields.
 */
function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.__v;
  return obj;
}

/**
 * Delay for a given number of milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safe JSON parse – returns null on failure.
 */
function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Convert cents to a formatted currency string.
 */
function centsToDisplay(cents, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

module.exports = { paginate, sanitizeUser, sleep, safeJsonParse, centsToDisplay };
