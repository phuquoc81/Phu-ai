'use strict';

const mongoose = require('mongoose');

const invoiceLineSchema = new mongoose.Schema(
  {
    description: String,
    amount: Number,
    currency: String,
    quantity: Number,
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    stripeInvoiceId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    stripePaymentIntentId: String,
    number: String,
    status: {
      type: String,
      enum: ['draft', 'open', 'paid', 'void', 'uncollectible'],
      default: 'draft',
    },
    currency: {
      type: String,
      default: 'usd',
      lowercase: true,
    },
    amountDue: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    lines: [invoiceLineSchema],
    periodStart: Date,
    periodEnd: Date,
    dueDate: Date,
    paidAt: Date,
    hostedInvoiceUrl: String,
    invoicePdf: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

invoiceSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
