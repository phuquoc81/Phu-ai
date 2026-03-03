'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validate, body } = require('../middleware/validation');
const {
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  cancelSubscription,
  listInvoices,
} = require('../controllers/stripeController');

router.use(authenticate, apiLimiter);

// POST /api/stripe/checkout
router.post(
  '/checkout',
  [
    body('priceId').notEmpty().withMessage('priceId is required'),
    validate,
  ],
  createCheckoutSession
);

// POST /api/stripe/portal
router.post('/portal', createPortalSession);

// GET /api/stripe/subscription
router.get('/subscription', getSubscription);

// DELETE /api/stripe/subscription
router.delete('/subscription', cancelSubscription);

// GET /api/stripe/invoices
router.get('/invoices', listInvoices);

module.exports = router;
