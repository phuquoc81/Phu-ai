'use strict';

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/payment');

const router = express.Router();

// ---------------------------------------------------------------------------
// GET /api/payments/config
// Returns the Stripe publishable key for the frontend.
// ---------------------------------------------------------------------------
router.get('/config', (_req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
  res.json({ publishableKey });
});

// ---------------------------------------------------------------------------
// POST /api/payments/create-intent
// Creates a Stripe PaymentIntent and a local transaction record.
// ---------------------------------------------------------------------------
router.post('/create-intent', async (req, res) => {
  const { amount, currency = 'usd', description = '', metadata = {} } = req.body;

  if (!amount || typeof amount !== 'number' || amount < 50) {
    return res
      .status(400)
      .json({ error: 'amount must be a number >= 50 (smallest currency unit, e.g. cents).' });
  }

  const allowedCurrencies = ['usd', 'eur', 'gbp', 'aud', 'cad', 'jpy'];
  if (!allowedCurrencies.includes(currency.toLowerCase())) {
    return res
      .status(400)
      .json({ error: `currency must be one of: ${allowedCurrencies.join(', ')}.` });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      description,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    const transaction = Payment.createTransaction({
      paymentIntentId: paymentIntent.id,
      amount,
      currency: currency.toLowerCase(),
      description,
      metadata,
    });

    return res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction.id,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('Stripe create-intent error:', err.message);
    return res.status(502).json({ error: 'Failed to create payment intent.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/payments/:transactionId
// Returns a local transaction record by its internal ID.
// ---------------------------------------------------------------------------
router.get('/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const transaction = Payment.findById(transactionId);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found.' });
  }
  return res.json(transaction);
});

// ---------------------------------------------------------------------------
// GET /api/payments
// Returns all local transaction records.
// ---------------------------------------------------------------------------
router.get('/', (_req, res) => {
  return res.json(Payment.listTransactions());
});

// ---------------------------------------------------------------------------
// POST /api/payments/webhook
// Handles Stripe webhook events.
// The route is mounted on /api/payments/webhook in server.js and receives the
// raw request body (required for signature verification).
// ---------------------------------------------------------------------------
router.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured.');
    return res.status(500).json({ error: 'Webhook secret not configured.' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  const intent = event.data.object;

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const tx = Payment.findByPaymentIntentId(intent.id);
      if (tx) Payment.updateTransaction(tx.id, { status: 'succeeded' });
      console.log(`PaymentIntent ${intent.id} succeeded.`);
      break;
    }
    case 'payment_intent.payment_failed': {
      const tx = Payment.findByPaymentIntentId(intent.id);
      if (tx) Payment.updateTransaction(tx.id, { status: 'failed' });
      const failMsg = intent.last_payment_error && intent.last_payment_error.message;
      console.warn(`PaymentIntent ${intent.id} failed: ${failMsg}`);
      break;
    }
    case 'payment_intent.canceled': {
      const tx = Payment.findByPaymentIntentId(intent.id);
      if (tx) Payment.updateTransaction(tx.id, { status: 'canceled' });
      console.log(`PaymentIntent ${intent.id} canceled.`);
      break;
    }
    default:
      // Acknowledge unhandled event types without error
      break;
  }

  return res.json({ received: true });
});

module.exports = router;
