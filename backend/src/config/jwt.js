'use strict';

const jwt = require('jsonwebtoken');

const config = {
  accessSecret: process.env.JWT_SECRET,
  accessExpiry: process.env.JWT_EXPIRY || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
};

if (!config.accessSecret || !config.refreshSecret) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment');
}

function signAccess(payload) {
  return jwt.sign(payload, config.accessSecret, { expiresIn: config.accessExpiry });
}

function signRefresh(payload) {
  return jwt.sign(payload, config.refreshSecret, { expiresIn: config.refreshExpiry });
}

function verifyAccess(token) {
  return jwt.verify(token, config.accessSecret);
}

function verifyRefresh(token) {
  return jwt.verify(token, config.refreshSecret);
}

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
