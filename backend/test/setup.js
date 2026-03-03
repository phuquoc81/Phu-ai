'use strict';

// Set environment variables before any module is loaded
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.MONGODB_URI = 'mongodb://localhost:27017/phuai_test';
process.env.JWT_SECRET = 'test_jwt_secret_at_least_32_chars_long';
process.env.JWT_EXPIRY = '1h';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_at_least_32_chars';
process.env.JWT_REFRESH_EXPIRY = '1d';
process.env.STRIPE_SECRET_KEY = 'sk_test_placeholder_for_tests';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_placeholder';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.LOG_LEVEL = 'silent';
