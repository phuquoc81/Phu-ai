'use strict';

const router = require('express').Router();
const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../config/jwt');
const { authenticate } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');
const {
  validate,
  emailField,
  passwordField,
  nameField,
  body,
} = require('../middleware/validation');
const logger = require('../utils/logger');

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post(
  '/register',
  authLimiter,
  [nameField(), emailField(), passwordField(), validate],
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ error: 'Email already in use' });

      const user = await User.create({ name, email, password });
      const accessToken = signAccess({ id: user.id, role: user.role });
      const refreshToken = signRefresh({ id: user.id });

      await User.findByIdAndUpdate(user.id, { $push: { refreshTokens: refreshToken } });

      logger.info({ userId: user.id }, 'User registered');
      res.status(201).json({ user, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post(
  '/login',
  authLimiter,
  [emailField(), body('password').notEmpty().withMessage('Password is required'), validate],
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password +refreshTokens');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (!user.isActive) {
        return res.status(403).json({ error: 'Account deactivated' });
      }

      const accessToken = signAccess({ id: user.id, role: user.role });
      const refreshToken = signRefresh({ id: user.id });

      user.refreshTokens.push(refreshToken);
      user.lastLoginAt = new Date();
      await user.save();

      logger.info({ userId: user.id }, 'User logged in');
      res.json({ user, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
router.post(
  '/refresh',
  authLimiter,
  [body('refreshToken').notEmpty().withMessage('Refresh token required'), validate],
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      let payload;
      try {
        payload = verifyRefresh(refreshToken);
      } catch {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }

      const user = await User.findById(payload.id).select('+refreshTokens');
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        return res.status(401).json({ error: 'Refresh token not recognized' });
      }

      // Rotate refresh token
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      const newRefreshToken = signRefresh({ id: user.id });
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      const accessToken = signAccess({ id: user.id, role: user.role });
      res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post(
  '/logout',
  authenticate,
  apiLimiter,
  [body('refreshToken').notEmpty().withMessage('Refresh token required'), validate],
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { refreshTokens: refreshToken },
      });
      logger.info({ userId: req.user.id }, 'User logged out');
      res.json({ message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', authenticate, apiLimiter, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('team', 'name slug plan');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
