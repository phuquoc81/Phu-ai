'use strict';

const request = require('supertest');
const app = require('../server');

describe('Security headers', () => {
  let res;
  beforeAll(async () => {
    res = await request(app).get('/health');
  });

  test('responds with 200', () => {
    expect(res.status).toBe(200);
  });

  test('has X-Content-Type-Options: nosniff', () => {
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  test('has X-Frame-Options: DENY', () => {
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  test('has Content-Security-Policy header', () => {
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
  });

  test('has Permissions-Policy header', () => {
    expect(res.headers['permissions-policy']).toBeDefined();
    expect(res.headers['permissions-policy']).toContain('camera=()');
  });

  test('has Referrer-Policy header', () => {
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });
});

describe('CORS policy', () => {
  test('blocks requests from unknown origins', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'https://evil.com');
    expect(res.status).toBe(403);
  });

  test('allows requests with no origin header (same-origin / server-to-server)', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});

describe('Rate limiting', () => {
  test('/payments routes use the payment rate limiter headers', async () => {
    const res = await request(app)
      .post('/payments/stripe/create-intent')
      .send({});
    expect(res.headers['ratelimit-limit']).toBeDefined();
  });
});

describe('Input validation', () => {
  test('POST /payments/stripe/create-intent rejects missing fields with 422', async () => {
    const res = await request(app)
      .post('/payments/stripe/create-intent')
      .send({});
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /payments/stripe/create-intent rejects invalid currency with 422', async () => {
    const res = await request(app)
      .post('/payments/stripe/create-intent')
      .send({ amount: 500, currency: 'US', gameId: '550e8400-e29b-41d4-a716-446655440000' });
    expect(res.status).toBe(422);
  });

  test('POST /payments/bank-transfer/initiate rejects missing fields with 422', async () => {
    const res = await request(app)
      .post('/payments/bank-transfer/initiate')
      .send({});
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /payments/bank-transfer/initiate rejects invalid accountNumber with 422', async () => {
    const res = await request(app)
      .post('/payments/bank-transfer/initiate')
      .send({
        amount: 100,
        currency: 'usd',
        gameId: '550e8400-e29b-41d4-a716-446655440000',
        accountName: 'John Doe',
        accountNumber: '!!!invalid!!!',
      });
    expect(res.status).toBe(422);
  });
});

describe('Stripe webhook', () => {
  test('returns 400 when stripe-signature header is missing', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';
    const res = await request(app)
      .post('/payments/stripe/webhook')
      .set('Content-Type', 'application/json')
      .send('{}');
    expect(res.status).toBe(400);
  });
});

describe('Bank transfer webhook', () => {
  test('returns 400 when x-bank-signature header is missing', async () => {
    process.env.BANK_TRANSFER_WEBHOOK_SECRET = 'dummy-secret';
    const res = await request(app)
      .post('/payments/bank-transfer/webhook')
      .set('Content-Type', 'application/json')
      .send('{}');
    expect(res.status).toBe(400);
  });
});
