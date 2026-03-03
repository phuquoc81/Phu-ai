'use strict';

const stripe = require('../config/stripe');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const logger = require('../utils/logger');

// ── Create Stripe checkout session ────────────────────────────────────────────
async function createCheckoutSession(req, res, next) {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    const user = await User.findById(req.user.id);

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${process.env.FRONTEND_URL}/dashboard?checkout=success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing?checkout=cancel`,
      subscription_data: {
        metadata: { userId: user.id },
      },
      allow_promotion_codes: true,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    next(err);
  }
}

// ── Open customer portal ───────────────────────────────────────────────────────
async function createPortalSession(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/billing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

// ── Get current subscription ──────────────────────────────────────────────────
async function getSubscription(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user.stripeSubscriptionId) {
      return res.json({ subscription: null });
    }

    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
      expand: ['default_payment_method', 'items.data.price.product'],
    });

    res.json({ subscription });
  } catch (err) {
    next(err);
  }
}

// ── Cancel subscription ───────────────────────────────────────────────────────
async function cancelSubscription(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    logger.info({ userId: user.id }, 'Subscription set to cancel at period end');
    res.json({ subscription });
  } catch (err) {
    next(err);
  }
}

// ── List invoices ─────────────────────────────────────────────────────────────
async function listInvoices(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [invoices, total] = await Promise.all([
      Invoice.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Invoice.countDocuments({ user: req.user.id }),
    ]);

    res.json({
      invoices,
      pagination: { page: Number(page), limit: Number(limit), total },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  cancelSubscription,
  listInvoices,
};
