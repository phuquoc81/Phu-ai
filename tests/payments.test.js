'use strict';

/**
 * Basic tests for the Stripe payment integration.
 * Uses Node.js built-in test runner (node --test).
 * Does NOT make real network calls – Stripe is not initialised.
 */

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

// ---------------------------------------------------------------------------
// Payment model tests
// ---------------------------------------------------------------------------
describe('Payment model', () => {
  const Payment = require('../models/payment');

  it('creates a transaction with default values', () => {
    const tx = Payment.createTransaction({ amount: 1000, currency: 'usd' });
    assert.ok(tx.id.startsWith('pay_'));
    assert.equal(tx.amount, 1000);
    assert.equal(tx.currency, 'usd');
    assert.equal(tx.status, 'pending');
  });

  it('finds a transaction by id', () => {
    const tx = Payment.createTransaction({ amount: 500, currency: 'eur' });
    const found = Payment.findById(tx.id);
    assert.deepEqual(found, tx);
  });

  it('finds a transaction by paymentIntentId', () => {
    const tx = Payment.createTransaction({
      amount: 200,
      paymentIntentId: 'pi_test_123',
    });
    const found = Payment.findByPaymentIntentId('pi_test_123');
    assert.equal(found.id, tx.id);
  });

  it('returns undefined for unknown paymentIntentId', () => {
    const found = Payment.findByPaymentIntentId('pi_does_not_exist');
    assert.equal(found, undefined);
  });

  it('updates a transaction status', () => {
    const tx = Payment.createTransaction({ amount: 999 });
    const updated = Payment.updateTransaction(tx.id, { status: 'succeeded' });
    assert.equal(updated.status, 'succeeded');
  });

  it('returns null when updating a non-existent transaction', () => {
    const result = Payment.updateTransaction('pay_nonexistent', { status: 'succeeded' });
    assert.equal(result, null);
  });

  it('lists transactions newest first', () => {
    const list = Payment.listTransactions();
    assert.ok(Array.isArray(list));
    for (let i = 1; i < list.length; i++) {
      assert.ok(list[i - 1].createdAt >= list[i].createdAt);
    }
  });

  it('normalises currency to lowercase', () => {
    const tx = Payment.createTransaction({ amount: 300, currency: 'GBP' });
    assert.equal(tx.currency, 'gbp');
  });
});

// ---------------------------------------------------------------------------
// HTTP API tests (using the Express app without a real Stripe key)
// ---------------------------------------------------------------------------
describe('Payment API routes', () => {
  let app;
  const http = require('node:http');

  before(() => {
    // Set dummy env vars so the server doesn't throw on startup
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
    process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_dummy';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';
    app = require('../server');
  });

  function request(method, path, body) {
    return new Promise((resolve, reject) => {
      const data = body ? JSON.stringify(body) : null;
      const options = {
        method,
        path,
        hostname: '127.0.0.1',
        port: 0, // placeholder; overwritten after server binds to an OS-assigned port
        headers: { 'Content-Type': 'application/json' },
      };
      // Use a one-shot server to get an available port
      const server = http.createServer(app);
      server.listen(0, '127.0.0.1', () => {
        const { port } = server.address();
        options.port = port;
        const req = http.request(options, (res) => {
          let raw = '';
          res.on('data', (chunk) => { raw += chunk; });
          res.on('end', () => {
            server.close();
            try {
              resolve({ status: res.statusCode, body: JSON.parse(raw) });
            } catch {
              resolve({ status: res.statusCode, body: raw });
            }
          });
        });
        req.on('error', (err) => { server.close(); reject(err); });
        if (data) req.write(data);
        req.end();
      });
    });
  }

  it('GET /health returns ok', async () => {
    const { status, body } = await request('GET', '/health');
    assert.equal(status, 200);
    assert.equal(body.status, 'ok');
  });

  it('GET /api/payments/config returns publishableKey', async () => {
    const { status, body } = await request('GET', '/api/payments/config');
    assert.equal(status, 200);
    assert.ok('publishableKey' in body);
  });

  it('GET /api/payments returns an array', async () => {
    const { status, body } = await request('GET', '/api/payments');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
  });

  it('POST /api/payments/create-intent rejects missing amount', async () => {
    const { status } = await request('POST', '/api/payments/create-intent', {});
    assert.equal(status, 400);
  });

  it('POST /api/payments/create-intent rejects amount < 50', async () => {
    const { status } = await request('POST', '/api/payments/create-intent', {
      amount: 10,
    });
    assert.equal(status, 400);
  });

  it('POST /api/payments/create-intent rejects invalid currency', async () => {
    const { status, body } = await request('POST', '/api/payments/create-intent', {
      amount: 500,
      currency: 'xyz',
    });
    assert.equal(status, 400);
    assert.ok(body.error.includes('currency'));
  });

  it('GET /api/payments/:transactionId returns 404 for unknown id', async () => {
    const { status } = await request('GET', '/api/payments/pay_unknown_id');
    assert.equal(status, 404);
  });
});
