'use strict';

/**
 * Security policies for the Bisswiz game platform.
 * Defines Content Security Policy (CSP), HTTP Strict Transport Security (HSTS),
 * and other security headers enforced via Helmet.
 */

const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    'https://js.stripe.com',
    'https://m.stripe.com',
  ],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:', 'https://q.stripe.com'],
  connectSrc: [
    "'self'",
    'https://api.stripe.com',
    'https://m.stripe.com',
  ],
  frameSrc: ['https://js.stripe.com', 'https://hooks.stripe.com'],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: [],
};

const HSTS_OPTIONS = {
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
};

const PERMISSIONS_POLICY = [
  'accelerometer=()',
  'camera=()',
  'geolocation=()',
  'gyroscope=()',
  'magnetometer=()',
  'microphone=()',
  'payment=(self "https://js.stripe.com")',
  'usb=()',
].join(', ');

function getHelmetOptions() {
  return {
    contentSecurityPolicy: { directives: CSP_DIRECTIVES },
    hsts: HSTS_OPTIONS,
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
  };
}

module.exports = { getHelmetOptions, PERMISSIONS_POLICY, CSP_DIRECTIVES, HSTS_OPTIONS };
