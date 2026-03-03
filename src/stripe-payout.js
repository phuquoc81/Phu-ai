'use strict';

/**
 * Phu AI – Stripe payout integration
 *
 * Sends an insurance payout via Stripe to the configured recipient when files
 * are detected as lost or a backup fails.
 *
 * STRIPE_SECRET_KEY must belong to the Stripe account of the payout recipient
 * (anhvankiet81@gmail.com / Phu Quoc Nguyen) so that stripe.payouts.create()
 * transfers funds directly to the linked bank account.
 *
 * Required environment variables:
 *   STRIPE_SECRET_KEY  – Stripe secret API key (sk_live_... or sk_test_...)
 *   PAYOUT_EMAIL       – Payout recipient e-mail for metadata / audit trail
 *                        (defaults to anhvankiet81@gmail.com)
 *   PAYOUT_AMOUNT      – Payout amount in smallest currency unit (e.g. cents)
 *                        (defaults to 1000 = $10.00 USD)
 *   PAYOUT_CURRENCY    – ISO 4217 currency code (defaults to "usd")
 */

const PAYOUT_EMAIL = process.env.PAYOUT_EMAIL || 'anhvankiet81@gmail.com';
const PAYOUT_AMOUNT = parseInt(process.env.PAYOUT_AMOUNT || '1000', 10);
const PAYOUT_CURRENCY = process.env.PAYOUT_CURRENCY || 'usd';

/**
 * Initialises and returns the Stripe client.
 * Throws if STRIPE_SECRET_KEY is not set.
 *
 * @returns {import('stripe').Stripe}
 */
function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY environment variable is not set. ' +
      'Please configure it before running payouts.'
    );
  }
  // eslint-disable-next-line global-require
  const Stripe = require('stripe');
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

/**
 * Triggers an insurance payout to the bank account linked to the Stripe
 * account identified by STRIPE_SECRET_KEY.
 *
 * Uses stripe.payouts.create() which moves funds from the Stripe balance to
 * the linked external bank account / debit card.  STRIPE_SECRET_KEY must
 * therefore belong to the account of the recipient (Phu Quoc Nguyen,
 * anhvankiet81@gmail.com).
 *
 * @returns {Promise<object>} Stripe Payout object
 */
async function triggerInsurancePayout() {
  const stripe = getStripeClient();

  console.log(
    `[stripe-payout] Creating insurance payout of ${PAYOUT_AMOUNT} ${PAYOUT_CURRENCY.toUpperCase()} ` +
    `to account linked to ${PAYOUT_EMAIL}…`
  );

  const payout = await stripe.payouts.create({
    amount: PAYOUT_AMOUNT,
    currency: PAYOUT_CURRENCY,
    description: 'Phu AI file-loss insurance payout',
    metadata: {
      recipient_email: PAYOUT_EMAIL,
      backup_device: 'phuhanddevice81',
      triggered_by: 'backup-insurance',
    },
  });

  console.log(`[stripe-payout] Payout created: ${payout.id} (status: ${payout.status})`);
  return payout;
}

module.exports = { triggerInsurancePayout, PAYOUT_EMAIL };
