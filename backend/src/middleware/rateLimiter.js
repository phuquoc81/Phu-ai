'use strict';

const rateLimit = require('express-rate-limit');

// ── Tier 1: global – 200 req / 15 min per IP ─────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', retryAfter: 15 * 60 },
});

// ── Tier 2: auth – 20 req / 15 min per IP (brute-force protection) ────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts', retryAfter: 15 * 60 },
});

// ── Tier 3: AI – 60 req / min per authenticated user ─────────────────────────
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => (req.user ? `user_${req.user.id}` : req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI rate limit exceeded', retryAfter: 60 },
});

// ── Tier 4: general API – 100 req / min per IP ────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', retryAfter: 60 },
});

module.exports = { globalLimiter, authLimiter, aiLimiter, apiLimiter };

