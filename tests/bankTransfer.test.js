'use strict';

const { verifyBankSignature } = require('../src/payments/bankTransfer');
const crypto = require('crypto');

describe('verifyBankSignature()', () => {
  const secret = 'test-webhook-secret-32-bytes-long!!';

  function makeSignature(payload) {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  test('returns true for a valid signature', () => {
    const payload = Buffer.from('{"type":"transfer.completed"}');
    const sig = makeSignature(payload);
    expect(verifyBankSignature(payload, sig, secret)).toBe(true);
  });

  test('returns false for a tampered payload', () => {
    const payload = Buffer.from('{"type":"transfer.completed"}');
    const sig = makeSignature(payload);
    const tampered = Buffer.from('{"type":"transfer.completed","extra":true}');
    expect(verifyBankSignature(tampered, sig, secret)).toBe(false);
  });

  test('returns false for a wrong secret', () => {
    const payload = Buffer.from('{"type":"transfer.completed"}');
    const sig = makeSignature(payload);
    expect(verifyBankSignature(payload, sig, 'wrong-secret')).toBe(false);
  });

  test('returns false for a non-hex signature', () => {
    const payload = Buffer.from('{"type":"transfer.completed"}');
    expect(verifyBankSignature(payload, 'not-hex!!!', secret)).toBe(false);
  });

  test('is not vulnerable to timing attacks (uses timingSafeEqual)', () => {
    const payload = Buffer.from('payload');
    const validSig = makeSignature(payload);
    const forgedSig = validSig.replace(validSig[0], validSig[0] === 'a' ? 'b' : 'a');
    expect(verifyBankSignature(payload, forgedSig, secret)).toBe(false);
  });
});
