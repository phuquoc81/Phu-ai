'use strict';

const { body, validationResult } = require('express-validator');

/**
 * Returns validation middleware for Stripe payment intent creation.
 */
function stripePaymentRules() {
  return [
    body('amount')
      .isInt({ min: 50, max: 99999900 })
      .withMessage('Amount must be an integer in the smallest currency unit (e.g. cents), between 50 and 99999900'),
    body('currency')
      .isAlpha()
      .isLength({ min: 3, max: 3 })
      .toLowerCase()
      .withMessage('Currency must be a valid 3-letter ISO code'),
    body('gameId')
      .isUUID()
      .withMessage('gameId must be a valid UUID'),
  ];
}

/**
 * Returns validation middleware for bank transfer initiation.
 */
function bankTransferRules() {
  return [
    body('amount')
      .isFloat({ min: 0.01, max: 999999 })
      .withMessage('Amount must be a positive number up to 999999'),
    body('currency')
      .isAlpha()
      .isLength({ min: 3, max: 3 })
      .toLowerCase()
      .withMessage('Currency must be a valid 3-letter ISO code'),
    body('gameId')
      .isUUID()
      .withMessage('gameId must be a valid UUID'),
    body('accountName')
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .escape()
      .withMessage('accountName is required and must be at most 100 characters'),
    body('accountNumber')
      .matches(/^[0-9A-Z\-]{6,34}$/)
      .withMessage('accountNumber must be 6–34 alphanumeric characters'),
    body('routingNumber')
      .optional()
      .matches(/^[0-9]{9}$/)
      .withMessage('routingNumber must be a 9-digit number'),
  ];
}

/**
 * Middleware that checks for validation errors and responds with 422 if any exist.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

module.exports = { stripePaymentRules, bankTransferRules, validate };
