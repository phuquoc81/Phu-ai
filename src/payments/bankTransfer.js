'use strict';

const crypto = require('crypto');
const express = require('express');
const { bankTransferRules, validate } = require('../middleware/validation');

const router = express.Router();

/**
 * Verifies a bank webhook payload using HMAC-SHA256.
 *
 * @param {string|Buffer} payload  Raw request body
 * @param {string} signature       Value of the X-Bank-Signature header
 * @param {string} secret          Shared webhook secret
 * @returns {boolean}
 */
function verifyBankSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * POST /payments/bank-transfer/initiate
 * Initiates a bank transfer for a game purchase.
 */
router.post(
  '/initiate',
  express.json(),
  bankTransferRules(),
  validate,
  async (req, res) => {
    const { amount, currency, gameId, accountName, accountNumber, routingNumber } = req.body;

    const bankApiUrl = process.env.BANK_API_URL;
    const bankApiKey = process.env.BANK_API_KEY;

    if (!bankApiUrl || !bankApiKey) {
      return res.status(500).json({ error: 'Bank transfer service is not configured' });
    }

    try {
      const https = require('https');
      const url = new URL('/transfers', bankApiUrl);
      const body = JSON.stringify({
        amount,
        currency: currency.toUpperCase(),
        gameId,
        recipientName: accountName,
        recipientAccount: accountNumber,
        routingNumber,
        sourceAccount: process.env.BANK_ACCOUNT_NUMBER,
      });

      const transferResult = await new Promise((resolve, reject) => {
        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            Authorization: `Bearer ${bankApiKey}`,
          },
        };

        const req = https.request(options, (response) => {
          let data = '';
          response.on('data', (chunk) => { data += chunk; });
          response.on('end', () => {
            try {
              resolve({ status: response.statusCode, body: JSON.parse(data) });
            } catch {
              reject(new Error('Invalid JSON response from bank API'));
            }
          });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
      });

      if (transferResult.status >= 400) {
        return res.status(502).json({ error: 'Bank transfer initiation failed' });
      }

      res.status(201).json({ transferId: transferResult.body.transferId });
    } catch {
      res.status(500).json({ error: 'Failed to initiate bank transfer' });
    }
  }
);

/**
 * POST /payments/bank-transfer/webhook
 * Receives bank transfer status updates.
 * Uses HMAC-SHA256 signature verification to authenticate the payload.
 */
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-bank-signature'];
  const secret = process.env.BANK_TRANSFER_WEBHOOK_SECRET;

  if (!secret) {
    return res.status(500).json({ error: 'Bank webhook secret not configured' });
  }

  if (!signature || !verifyBankSignature(req.body, signature, secret)) {
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  switch (event.type) {
    case 'transfer.completed':
      break;
    case 'transfer.failed':
      break;
    default:
      break;
  }

  res.json({ received: true });
});

module.exports = { router, verifyBankSignature };
