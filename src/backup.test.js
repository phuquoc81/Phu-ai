'use strict';

const assert = require('assert');
const { test } = require('node:test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const { isBackupHealthy } = require('./backup');

test('isBackupHealthy returns false for non-existent directory', () => {
  const result = isBackupHealthy('/tmp/non-existent-phu-ai-backup-dir');
  assert.strictEqual(result, false);
});

test('isBackupHealthy returns false for empty directory', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'phu-ai-test-'));
  const result = isBackupHealthy(dir);
  assert.strictEqual(result, false);
  fs.rmdirSync(dir);
});

test('isBackupHealthy returns true when backup archives are present', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'phu-ai-test-'));
  fs.writeFileSync(path.join(dir, 'phu-ai-backup-2024-01-01.tar.gz'), 'data');
  const result = isBackupHealthy(dir);
  assert.strictEqual(result, true);
  fs.rmSync(dir, { recursive: true });
});

test('PAYOUT_EMAIL defaults to anhvankiet81@gmail.com', () => {
  // Bust the module cache so the default env var is re-evaluated
  delete process.env.PAYOUT_EMAIL;
  delete require.cache[require.resolve('./stripe-payout')];
  const payout = require('./stripe-payout');
  assert.strictEqual(payout.PAYOUT_EMAIL, 'anhvankiet81@gmail.com');
});

test('triggerInsurancePayout throws when STRIPE_SECRET_KEY is missing', async () => {
  const savedKey = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  const { triggerInsurancePayout } = require('./stripe-payout');
  await assert.rejects(
    () => triggerInsurancePayout(),
    /STRIPE_SECRET_KEY environment variable is not set/
  );
  if (savedKey !== undefined) {
    process.env.STRIPE_SECRET_KEY = savedKey;
  }
});
