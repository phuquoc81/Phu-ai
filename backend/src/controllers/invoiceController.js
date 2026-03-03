'use strict';

const Invoice = require('../models/Invoice');

// ── List invoices for authenticated user ──────────────────────────────────────
async function listInvoices(req, res, next) {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [invoices, total] = await Promise.all([
      Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Invoice.countDocuments(filter),
    ]);

    res.json({
      invoices,
      pagination: { page: Number(page), limit: Number(limit), total },
    });
  } catch (err) {
    next(err);
  }
}

// ── Get single invoice ────────────────────────────────────────────────────────
async function getInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    res.json({ invoice });
  } catch (err) {
    next(err);
  }
}

// ── Redirect to Stripe-hosted PDF ─────────────────────────────────────────────
async function downloadInvoicePdf(req, res, next) {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    if (!invoice.invoicePdf) {
      return res.status(404).json({ error: 'PDF not available yet' });
    }

    res.redirect(302, invoice.invoicePdf);
  } catch (err) {
    next(err);
  }
}

module.exports = { listInvoices, getInvoice, downloadInvoicePdf };
