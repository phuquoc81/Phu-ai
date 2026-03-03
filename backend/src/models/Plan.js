'use strict';

const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    included: { type: Boolean, default: true },
    limit: Number,
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: String,
    monthlyPrice: {
      type: Number,
      required: true,
    },
    annualPrice: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    stripePriceIdMonthly: String,
    stripePriceIdAnnual: String,
    creditsPerMonth: {
      type: Number,
      required: true,
    },
    maxTeamMembers: {
      type: Number,
      default: 1,
    },
    features: [featureSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
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

module.exports = mongoose.model('Plan', planSchema);
