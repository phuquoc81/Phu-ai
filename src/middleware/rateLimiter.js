'use strict';

const rateLimit = require('express-rate-limit');

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;
const max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100;
const paymentMax = parseInt(process.env.PAYMENT_RATE_LIMIT_MAX, 10) || 10;

/**
 * General API rate limiter: 100 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

/**
 * Stricter rate limiter for payment endpoints: 10 requests per 15 minutes per IP.
 * Reduces the risk of enumeration attacks and brute-force payment attempts.
 */
const paymentLimiter = rateLimit({
  windowMs,
  max: paymentMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment requests, please try again later.' },
});

module.exports = { apiLimiter, paymentLimiter };
