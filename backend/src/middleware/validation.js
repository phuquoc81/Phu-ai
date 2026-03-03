'use strict';

const { validationResult, body, param, query } = require('express-validator');

// ── Run validations and return 422 on failure ─────────────────────────────────
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }
  next();
}

// ── Reusable validation chains ────────────────────────────────────────────────
const emailField = (field = 'email') =>
  body(field)
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .toLowerCase();

const passwordField = (field = 'password') =>
  body(field)
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number');

const nameField = (field = 'name') =>
  body(field).trim().notEmpty().withMessage(`${field} is required`).isLength({ max: 100 });

const mongoIdParam = (field = 'id') =>
  param(field).isMongoId().withMessage(`Invalid ${field}`);

const paginationQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

module.exports = {
  validate,
  emailField,
  passwordField,
  nameField,
  mongoIdParam,
  paginationQuery,
  body,
  param,
  query,
};
