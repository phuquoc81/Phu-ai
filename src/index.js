'use strict';

/**
 * Phu AI – main entry point
 *
 * Starts the application and schedules automated backup insurance checks.
 */

const { runInsurance } = require('./backup');

const BACKUP_INTERVAL_HOURS = parseInt(process.env.BACKUP_INTERVAL_HOURS || '24', 10);
const BACKUP_INTERVAL_MS = BACKUP_INTERVAL_HOURS * 60 * 60 * 1000;

console.log('Phu AI started.');
console.log(`Backup insurance check scheduled every ${BACKUP_INTERVAL_HOURS} hour(s).`);

// Run an initial backup check on startup
runInsurance().catch(err => console.error('[main] Insurance error:', err.message));

// Schedule recurring backup checks
const intervalId = setInterval(() => {
  runInsurance().catch(err => console.error('[main] Insurance error:', err.message));
}, BACKUP_INTERVAL_MS);

// Graceful shutdown on SIGTERM / SIGINT
function shutdown(signal) {
  console.log(`[main] Received ${signal}. Shutting down…`);
  clearInterval(intervalId);
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
