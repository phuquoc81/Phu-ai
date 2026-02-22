'use strict';

const express = require('express');
const Stripe = require('stripe');
const { stripePaymentRules, validate } = require('../middleware/validation');

const router = express.Router();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });
}

/**
 * POST /payments/stripe/create-intent
 * Creates a Stripe PaymentIntent for a game purchase.
 */
router.post(
  '/create-intent',
  stripePaymentRules(),
  validate,
  async (req, res) => {
    const { amount, currency, gameId } = req.body;
    try {
      const stripe = getStripe();
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: { gameId },
        automatic_payment_methods: { enabled: true },
      });
      res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  }
);

/**
 * POST /payments/stripe/webhook
 * Receives and verifies Stripe webhook events.
 * The raw body is required for signature verification; the route must be registered
 * before the JSON body-parser in server.js using express.raw().
 */
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      break;
    case 'payment_intent.payment_failed':
      break;
    default:
      break;
  }

  res.json({ received: true });
});

module.exports = router;
