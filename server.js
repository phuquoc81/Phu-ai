'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
const Stripe = require('stripe');

// ─── Stripe initialisation ────────────────────────────────────────────────────
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});

// ─── Application ─────────────────────────────────────────────────────────────
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ─── Product catalogue (in-memory; replace with DB in production) ─────────────
const PRODUCTS = [
  { id: 'prod_001', name: 'Wireless Headphones', price: 7999, currency: 'cad', image: '🎧' },
  { id: 'prod_002', name: 'Mechanical Keyboard', price: 12999, currency: 'cad', image: '⌨️' },
  { id: 'prod_003', name: 'USB-C Hub',           price: 4999, currency: 'cad', image: '🔌' },
  { id: 'prod_004', name: 'Webcam HD',           price: 8999, currency: 'cad', image: '📷' },
];

// ─── Stripe webhook (raw body required – must be registered BEFORE json parser) ─
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET not configured – skipping signature check');
      return res.sendStatus(200);
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('PaymentIntent succeeded:', event.data.object.id);
        // TODO: fulfil order in your database
        break;
      case 'payment_intent.payment_failed':
        console.warn('PaymentIntent failed:', event.data.object.id);
        break;
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.sendStatus(200);
  }
);

// ─── Security: parse JSON for remaining routes ────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ─── Security: HTTP headers via Helmet ───────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://js.stripe.com',
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        connectSrc: ["'self'", 'https://api.stripe.com'],
        imgSrc: ["'self'", 'data:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        upgradeInsecureRequests: IS_PRODUCTION ? [] : null,
      },
    },
    hsts: IS_PRODUCTION
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
  })
);

// ─── Security: CORS ───────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / server-to-server calls (no Origin header)
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      cb(new Error('CORS: origin not allowed'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Security: global rate limiter ───────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  })
);

// Stricter limiter for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment requests, please slow down.' },
});

// ─── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── API: product catalogue ───────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

// ─── API: create Stripe PaymentIntent ────────────────────────────────────────
//
// Supports:
//   • card (Visa / Mastercard / Amex / etc.)
//   • acss_debit  – Canadian bank / e-Transfer (pre-authorised debit)
//   • us_bank_account – US ACH bank transfer
//
app.post(
  '/api/create-payment-intent',
  paymentLimiter,
  [
    body('productId')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('productId is required'),
    body('paymentMethodType')
      .isIn(['card', 'acss_debit', 'us_bank_account'])
      .withMessage('paymentMethodType must be card, acss_debit, or us_bank_account'),
    body('customerName')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 120 })
      .withMessage('customerName is required (max 120 chars)'),
    body('customerEmail')
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid customerEmail is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, paymentMethodType, customerName, customerEmail } = req.body;

    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    try {
      // Build PaymentIntent params per payment method
      const intentParams = {
        amount: product.price,
        currency: product.currency,
        payment_method_types: [paymentMethodType],
        metadata: {
          productId: product.id,
          productName: product.name,
          customerName,
          customerEmail,
        },
      };

      // Canadian pre-authorised debit (covers Interac e-Transfer-style flows)
      if (paymentMethodType === 'acss_debit') {
        intentParams.payment_method_options = {
          acss_debit: {
            mandate_options: {
              payment_schedule: 'sporadic',
              transaction_type: 'personal',
            },
          },
        };
      }

      // US ACH bank transfer
      if (paymentMethodType === 'us_bank_account') {
        intentParams.payment_method_options = {
          us_bank_account: {
            financial_connections: {
              permissions: ['payment_method'],
            },
          },
        };
      }

      const paymentIntent = await stripe.paymentIntents.create(intentParams);

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error('Stripe error:', err.message);
      res.status(500).json({ error: 'Payment initialisation failed. Please try again.' });
    }
  }
);

// ─── API: create Stripe Checkout Session (hosted page) ───────────────────────
//
// Alternative flow: redirect the customer to Stripe's hosted checkout page,
// which supports card, acss_debit, and bank transfers out of the box.
//
app.post(
  '/api/create-checkout-session',
  paymentLimiter,
  [
    body('productId')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('productId is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = PRODUCTS.find((p) => p.id === req.body.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const baseUrl = IS_PRODUCTION
      ? `https://${req.hostname}`
      : `http://${req.hostname}:${PORT}`;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'acss_debit'],
        line_items: [
          {
            price_data: {
              currency: product.currency,
              product_data: { name: product.name },
              unit_amount: product.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cancel.html`,
        metadata: { productId: product.id },
      });

      res.json({ url: session.url });
    } catch (err) {
      console.error('Stripe Checkout error:', err.message);
      res.status(500).json({ error: 'Could not create checkout session. Please try again.' });
    }
  }
);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err.stack);
  const status = err.status || 500;
  // Never leak internal error details in production
  const message = IS_PRODUCTION ? 'Internal server error' : err.message;
  res.status(status).json({ error: message });
});

// ─── Start server ─────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Shop-Anglo server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app; // export for tests
