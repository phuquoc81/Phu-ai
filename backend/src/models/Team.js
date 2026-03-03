'use strict';

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: [100, 'Team name must not exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [memberSchema],
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    stripeCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'trialing', 'past_due', 'canceled', 'unpaid'],
      default: 'inactive',
    },
    credits: {
      total: { type: Number, default: 500 },
      used: { type: Number, default: 0 },
    },
    maxMembers: {
      type: Number,
      default: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    pendingInvites: [
      {
        email: { type: String, lowercase: true, trim: true },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
        token: String,
        expiresAt: Date,
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Auto-generate slug from name ──────────────────────────────────────────────
teamSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

teamSchema.virtual('credits.available').get(function () {
  return Math.max(0, this.credits.total - this.credits.used);
});

teamSchema.virtual('memberCount').get(function () {
  return this.members.length;
});

module.exports = mongoose.model('Team', teamSchema);
