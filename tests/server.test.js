'use strict';

// Basic integration tests for Shop-Anglo server
// Run with: node --test tests/

const { test } = require('node:test');
const assert = require('node:assert/strict');

// Use a stub Stripe key so the module loads without a real key
process.env.STRIPE_SECRET_KEY = 'sk_test_placeholder';
process.env.NODE_ENV = 'test';

const app = require('../server');
const http = require('http');

// Helper: make a simple HTTP request against the app
function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, () => {
      const { port } = server.address();
      const data = body ? JSON.stringify(body) : null;
      const opts = {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data ? Buffer.byteLength(data) : 0,
          ...headers,
        },
      };
      const req = http.request(opts, (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          server.close();
          resolve({ status: res.statusCode, headers: res.headers, body: raw });
        });
      });
      req.on('error', (e) => { server.close(); reject(e); });
      if (data) req.write(data);
      req.end();
    });
  });
}

// ── Health check ──────────────────────────────────────────────────────────────
test('GET /health returns 200 and status ok', async () => {
  const { status, body } = await request('GET', '/health');
  assert.equal(status, 200);
  const json = JSON.parse(body);
  assert.equal(json.status, 'ok');
});

// ── Product catalogue ─────────────────────────────────────────────────────────
test('GET /api/products returns array with at least 1 product', async () => {
  const { status, body } = await request('GET', '/api/products');
  assert.equal(status, 200);
  const json = JSON.parse(body);
  assert.ok(Array.isArray(json));
  assert.ok(json.length >= 1);
  assert.ok(json[0].id);
  assert.ok(json[0].name);
  assert.ok(typeof json[0].price === 'number');
});

// ── Validation: missing fields ────────────────────────────────────────────────
test('POST /api/create-payment-intent with missing body returns 400', async () => {
  const { status, body } = await request('POST', '/api/create-payment-intent', {});
  assert.equal(status, 400);
  const json = JSON.parse(body);
  assert.ok(Array.isArray(json.errors));
});

test('POST /api/create-payment-intent with invalid email returns 400', async () => {
  const { status, body } = await request('POST', '/api/create-payment-intent', {
    productId: 'prod_001',
    paymentMethodType: 'card',
    customerName: 'Test User',
    customerEmail: 'not-an-email',
  });
  assert.equal(status, 400);
  const json = JSON.parse(body);
  assert.ok(Array.isArray(json.errors));
});

test('POST /api/create-payment-intent with unknown productId returns 404', async () => {
  const { status, body } = await request('POST', '/api/create-payment-intent', {
    productId: 'nonexistent',
    paymentMethodType: 'card',
    customerName: 'Test User',
    customerEmail: 'test@example.com',
  });
  assert.equal(status, 404);
  const json = JSON.parse(body);
  assert.ok(json.error);
});

test('POST /api/create-payment-intent with invalid paymentMethodType returns 400', async () => {
  const { status, body } = await request('POST', '/api/create-payment-intent', {
    productId: 'prod_001',
    paymentMethodType: 'paypal',
    customerName: 'Test User',
    customerEmail: 'test@example.com',
  });
  assert.equal(status, 400);
});

// ── Checkout session: validation ──────────────────────────────────────────────
test('POST /api/create-checkout-session with missing productId returns 400', async () => {
  const { status } = await request('POST', '/api/create-checkout-session', {});
  assert.equal(status, 400);
});

test('POST /api/create-checkout-session with unknown productId returns 404', async () => {
  const { status, body } = await request('POST', '/api/create-checkout-session', {
    productId: 'nonexistent',
  });
  assert.equal(status, 404);
  const json = JSON.parse(body);
  assert.ok(json.error);
});

// ── 404 for unknown routes ────────────────────────────────────────────────────
test('GET /nonexistent returns 404', async () => {
  const { status } = await request('GET', '/nonexistent-route');
  assert.equal(status, 404);
});

// ── Security headers ──────────────────────────────────────────────────────────
test('GET /health includes security headers from Helmet', async () => {
  const { headers } = await request('GET', '/health');
  assert.ok(headers['x-content-type-options'], 'x-content-type-options header missing');
  assert.ok(headers['x-frame-options'] || headers['content-security-policy'], 'security headers missing');
});
