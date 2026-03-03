'use strict';

const { verifyAccess } = require('../config/jwt');
const User = require('../models/User');
const logger = require('../utils/logger');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed authorization header' });
    }

    const token = authHeader.slice(7);
    let payload;
    try {
      payload = verifyAccess(token);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }

    const user = await User.findById(payload.id).select('-refreshTokens');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User account not found or deactivated' });
    }

    req.user = { id: user.id, email: user.email, role: user.role, _id: user._id };
    next();
  } catch (err) {
    logger.error({ err }, 'Authentication error');
    next(err);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
