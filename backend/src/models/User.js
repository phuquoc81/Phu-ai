'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'team_owner', 'team_member'],
      default: 'user',
    },
    stripeCustomerId: {
      type: String,
      index: true,
    },
    stripeSubscriptionId: {
      type: String,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'trialing', 'past_due', 'canceled', 'unpaid'],
      default: 'inactive',
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    credits: {
      total: { type: Number, default: 100 },
      used: { type: Number, default: 0 },
      resetAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    refreshTokens: {
      type: [String],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Virtual: available credits ────────────────────────────────────────────────
userSchema.virtual('credits.available').get(function () {
  return Math.max(0, this.credits.total - this.credits.used);
});

// ── Pre-save: hash password ───────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

// ── Instance method: compare password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ── Instance method: deduct credits ──────────────────────────────────────────
userSchema.methods.deductCredits = async function (amount) {
  if (this.credits.available < amount) {
    const err = new Error('Insufficient credits');
    err.statusCode = 402;
    throw err;
  }
  this.credits.used += amount;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
