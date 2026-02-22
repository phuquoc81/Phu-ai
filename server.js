'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { getHelmetOptions, PERMISSIONS_POLICY } = require('./src/security/policies');
const { createServer } = require('./src/security/certificates');
const { apiLimiter, paymentLimiter } = require('./src/middleware/rateLimiter');
const stripeRouter = require('./src/payments/stripe');
const { router: bankTransferRouter } = require('./src/payments/bankTransfer');

const app = express();

// ------------------------------------------------------------------
// Security headers
// ------------------------------------------------------------------
app.use(helmet(getHelmetOptions()));
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', PERMISSIONS_POLICY);
  next();
});

// ------------------------------------------------------------------
// CORS – restrict to known origins
// ------------------------------------------------------------------
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ------------------------------------------------------------------
// Body parsing (stripe webhook routes register express.raw() themselves
// before this global JSON parser)
// ------------------------------------------------------------------
app.use(express.json({ limit: '10kb' }));

// ------------------------------------------------------------------
// Rate limiting
// ------------------------------------------------------------------
app.use('/api', apiLimiter);
app.use('/payments', paymentLimiter);

// ------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/payments/stripe', stripeRouter);
app.use('/payments/bank-transfer', bankTransferRouter);

// ------------------------------------------------------------------
// 404 handler
// ------------------------------------------------------------------
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// ------------------------------------------------------------------
// Global error handler
// ------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// ------------------------------------------------------------------
// Start server
// ------------------------------------------------------------------
if (require.main === module) {
  const PORT = parseInt(process.env.PORT, 10) || 3000;
  const server = createServer(app);
  server.listen(PORT, () => {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    console.log(`Bisswiz server running on ${protocol}://localhost:${PORT}`);
  });
}

module.exports = app;
