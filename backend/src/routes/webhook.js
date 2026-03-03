'use strict';

/**
 * Stripe webhook handler.
 * Must be mounted BEFORE express.json() so it receives the raw body.
 */

const router = require('express').Router();
const stripe = require('../config/stripe');
const { apiLimiter } = require('../middleware/rateLimiter');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const logger = require('../utils/logger');

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Raw body parser for signature verification
router.post(
  '/',
  require('express').raw({ type: 'application/json' }),
  apiLimiter,
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    if (!sig || !WEBHOOK_SECRET) {
      logger.warn('Webhook received without signature or secret not configured');
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    } catch (err) {
      logger.warn({ err: err.message }, 'Webhook signature verification failed');
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    logger.info({ type: event.type, id: event.id }, 'Stripe webhook received');

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const sub = event.data.object;
          const plan = resolvePlan(sub);
          await User.findOneAndUpdate(
            { stripeCustomerId: sub.customer },
            {
              stripeSubscriptionId: sub.id,
              subscriptionStatus: sub.status,
              plan,
            }
          );
          break;
        }

        case 'customer.subscription.deleted': {
          const sub = event.data.object;
          await User.findOneAndUpdate(
            { stripeCustomerId: sub.customer },
            { subscriptionStatus: 'canceled', plan: 'free', stripeSubscriptionId: null }
          );
          break;
        }

        case 'invoice.payment_succeeded': {
          const inv = event.data.object;
          await syncInvoice(inv, 'paid');
          break;
        }

        case 'invoice.payment_failed': {
          const inv = event.data.object;
          await syncInvoice(inv, 'open');
          await User.findOneAndUpdate(
            { stripeCustomerId: inv.customer },
            { subscriptionStatus: 'past_due' }
          );
          break;
        }

        default:
          logger.debug({ type: event.type }, 'Unhandled webhook event');
      }
    } catch (err) {
      logger.error({ err, eventType: event.type }, 'Webhook handler error');
      return res.status(500).json({ error: 'Webhook processing failed' });
    }

    res.json({ received: true });
  }
);

function resolvePlan(subscription) {
  const priceId = subscription.items?.data?.[0]?.price?.id;
  if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) return 'enterprise';
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
  return 'free';
}

async function syncInvoice(stripeInv, status) {
  const user = await User.findOne({ stripeCustomerId: stripeInv.customer });
  if (!user) return;

  await Invoice.findOneAndUpdate(
    { stripeInvoiceId: stripeInv.id },
    {
      user: user._id,
      stripeInvoiceId: stripeInv.id,
      stripePaymentIntentId: stripeInv.payment_intent,
      number: stripeInv.number,
      status,
      currency: stripeInv.currency,
      amountDue: stripeInv.amount_due,
      amountPaid: stripeInv.amount_paid,
      hostedInvoiceUrl: stripeInv.hosted_invoice_url,
      invoicePdf: stripeInv.invoice_pdf,
      periodStart: new Date(stripeInv.period_start * 1000),
      periodEnd: new Date(stripeInv.period_end * 1000),
      paidAt: status === 'paid' ? new Date() : undefined,
    },
    { upsert: true, new: true }
  );
}

module.exports = router;
