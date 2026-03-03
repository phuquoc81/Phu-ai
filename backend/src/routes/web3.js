'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validate, body } = require('../middleware/validation');
const { verifyTokenPayment, getPaymentInfo } = require('../controllers/web3Controller');

router.use(authenticate, apiLimiter);

// GET /api/web3/info
router.get('/info', getPaymentInfo);

// POST /api/web3/verify
router.post(
  '/verify',
  [
    body('txHash')
      .trim()
      .notEmpty()
      .withMessage('Transaction hash is required')
      .matches(/^0x[a-fA-F0-9]{64}$/)
      .withMessage('Invalid transaction hash format'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('walletAddress')
      .trim()
      .notEmpty()
      .withMessage('Wallet address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/)
      .withMessage('Invalid Ethereum wallet address'),
    validate,
  ],
  verifyTokenPayment
);

module.exports = router;
