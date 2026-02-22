'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');

/**
 * Loads TLS certificate files for the Bisswiz HTTPS server.
 * Returns null in non-production environments so the app can run
 * without certificates during development.
 *
 * @returns {{ key: Buffer, cert: Buffer, ca: Buffer } | null}
 */
function loadCertificates() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const certPath = process.env.SSL_CERT_PATH;
  const keyPath = process.env.SSL_KEY_PATH;
  const caPath = process.env.SSL_CA_PATH;

  if (!certPath || !keyPath) {
    throw new Error(
      'SSL_CERT_PATH and SSL_KEY_PATH environment variables are required in production'
    );
  }

  const options = {
    key: fs.readFileSync(path.resolve(keyPath)),
    cert: fs.readFileSync(path.resolve(certPath)),
    minVersion: 'TLSv1.2',
    ciphers: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-GCM-SHA256',
    ].join(':'),
  };

  if (caPath) {
    options.ca = fs.readFileSync(path.resolve(caPath));
  }

  return options;
}

/**
 * Creates an HTTPS server if TLS certificates are available,
 * otherwise creates an HTTP server (for local development only).
 *
 * @param {import('express').Application} app
 * @returns {import('http').Server | import('https').Server}
 */
function createServer(app) {
  const tlsOptions = loadCertificates();
  if (tlsOptions) {
    return https.createServer(tlsOptions, app);
  }
  const http = require('http');
  return http.createServer(app);
}

module.exports = { loadCertificates, createServer };
