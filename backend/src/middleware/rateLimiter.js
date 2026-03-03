'use strict';

const { RateLimiterMemory } = require('rate-limiter-flexible');

// ── Tier 1: global – 200 req / 15 min per IP ─────────────────────────────────
const globalStore = new RateLimiterMemory({
  points: 200,
  duration: 15 * 60,
  blockDuration: 60,
});

// ── Tier 2: auth – 20 req / 15 min per IP (brute-force protection) ────────────
const authStore = new RateLimiterMemory({
  points: 20,
  duration: 15 * 60,
  blockDuration: 5 * 60,
});

// ── Tier 3: AI – 60 req / min per authenticated user ─────────────────────────
const aiStore = new RateLimiterMemory({
  points: 60,
  duration: 60,
  blockDuration: 60,
});

function makeMiddleware(limiter, keyFn) {
  return async (req, res, next) => {
    try {
      const key = keyFn(req);
      await limiter.consume(key);
      next();
    } catch (rlRes) {
      const retryAfter = Math.ceil((rlRes.msBeforeNext || 1000) / 1000);
      res.set('Retry-After', retryAfter);
      res.status(429).json({
        error: 'Too many requests',
        retryAfter,
      });
    }
  };
}

// ── Tier 4: general API – 100 req / min per IP (covers all non-auth routes) ───
const apiStore = new RateLimiterMemory({
  points: 100,
  duration: 60,
  blockDuration: 60,
});

const globalLimiter = makeMiddleware(globalStore, (req) => req.ip);
const authLimiter = makeMiddleware(authStore, (req) => req.ip);
const aiLimiter = makeMiddleware(
  aiStore,
  (req) => (req.user ? `user_${req.user.id}` : req.ip)
);
const apiLimiter = makeMiddleware(apiStore, (req) => req.ip);

module.exports = { globalLimiter, authLimiter, aiLimiter, apiLimiter };
