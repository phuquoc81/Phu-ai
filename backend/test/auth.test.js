'use strict';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password1',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('POST /api/auth/register', () => {
  it('should register a new user and return tokens', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toBe(TEST_USER.email);
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should return 422 for missing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', password: 'Password1' });
    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('details');
  });

  it('should return 422 for weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...TEST_USER, password: 'weak' });
    expect(res.statusCode).toBe(422);
  });

  it('should return 409 for duplicate email', async () => {
    await request(app).post('/api/auth/register').send(TEST_USER);
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    expect(res.statusCode).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(TEST_USER);
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: TEST_USER.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: 'WrongPass1' });
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@example.com', password: 'Password1' });
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/auth/refresh', () => {
  let refreshToken;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    refreshToken = res.body.refreshToken;
  });

  it('should issue new tokens given a valid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.refreshToken).not.toBe(refreshToken); // rotated
  });

  it('should return 401 for an invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'invalid.token.here' });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  let accessToken;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    accessToken = res.body.accessToken;
  });

  it('should return the authenticated user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(TEST_USER.email);
  });

  it('should return 401 without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 with a malformed token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer bad.token');
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  let accessToken;
  let refreshToken;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should logout and invalidate the refresh token', async () => {
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken });
    expect(logoutRes.statusCode).toBe(200);

    // Refresh token should no longer work
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(refreshRes.statusCode).toBe(401);
  });
});

describe('GET /health', () => {
  it('should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
