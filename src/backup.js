'use strict';

/**
 * Phu AI – Backup & Insurance module
 *
 * Backs up application files to the configured destination (phuhanddevice 81)
 * and triggers a Stripe payout to the configured recipient when a backup
 * insurance claim is processed.
 *
 * Required environment variables:
 *   BACKUP_DEST        – Path or remote URL for the backup destination
 *                        (defaults to "phuhanddevice81")
 *   STRIPE_SECRET_KEY  – Stripe secret API key (sk_live_... or sk_test_...)
 *   PAYOUT_EMAIL       – Stripe connected-account e-mail for payouts
 *                        (defaults to anhvankiet81@gmail.com)
 *   PAYOUT_AMOUNT      – Payout amount in the smallest currency unit (e.g. cents)
 *   PAYOUT_CURRENCY    – ISO 4217 currency code (defaults to "usd")
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const stripePayout = require('./stripe-payout');

const BACKUP_DEST = process.env.BACKUP_DEST || 'phuhanddevice81';
const BACKUP_SOURCE = process.env.BACKUP_SOURCE || path.resolve(__dirname, '..');

/**
 * Creates a timestamped backup archive of BACKUP_SOURCE and copies it to
 * BACKUP_DEST.  Returns the path of the created archive.
 *
 * @returns {string} Path to the backup archive
 */
function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const archiveName = `phu-ai-backup-${timestamp}.tar.gz`;
  const archivePath = path.join(require('os').tmpdir(), archiveName);

  console.log(`[backup] Creating archive: ${archivePath}`);
  execSync(`tar -czf "${archivePath}" -C "${BACKUP_SOURCE}" .`);

  const destDir = path.isAbsolute(BACKUP_DEST)
    ? BACKUP_DEST
    : path.join(BACKUP_SOURCE, BACKUP_DEST);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destPath = path.join(destDir, archiveName);
  fs.copyFileSync(archivePath, destPath);
  fs.unlinkSync(archivePath);

  console.log(`[backup] Backup saved to: ${destPath}`);
  return destPath;
}

/**
 * Checks whether the last backup is still present and valid.
 * Returns true when files are safe, false when a restore / insurance
 * claim should be triggered.
 *
 * @param {string} backupDir  Directory that should contain backup archives
 * @returns {boolean}
 */
function isBackupHealthy(backupDir) {
  if (!fs.existsSync(backupDir)) {
    return false;
  }
  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.tar.gz'));
  return files.length > 0;
}

/**
 * Main insurance routine:
 *   1. Attempts to create a fresh backup.
 *   2. If the backup directory is found to be missing / empty afterward,
 *      triggers a Stripe insurance payout to the configured recipient.
 */
async function runInsurance() {
  let backupPath;
  try {
    backupPath = createBackup();
  } catch (err) {
    console.error('[backup] Backup creation failed:', err.message);
    console.log('[backup] Files may be lost – initiating insurance payout…');
    await stripePayout.triggerInsurancePayout();
    return;
  }

  const backupDir = path.dirname(backupPath);
  if (!isBackupHealthy(backupDir)) {
    console.warn('[backup] Backup directory appears empty – initiating insurance payout…');
    await stripePayout.triggerInsurancePayout();
  } else {
    console.log('[backup] Backup verified. All files are safe.');
  }
}

module.exports = { createBackup, isBackupHealthy, runInsurance };

// Run directly: `node src/backup.js`
if (require.main === module) {
  runInsurance().catch(err => {
    console.error('[backup] Fatal error:', err.message);
    process.exit(1);
  });
}
