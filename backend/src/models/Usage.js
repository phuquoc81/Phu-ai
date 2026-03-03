'use strict';

const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema(
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
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['ai_text', 'ai_query', 'ai_image', 'ai_audio', 'ai_code', 'api_call'],
    },
    credits: {
      type: Number,
      required: true,
      min: [0, 'Credits must be non-negative'],
    },
    metadata: {
      model: String,
      promptTokens: Number,
      completionTokens: Number,
      totalTokens: Number,
      durationMs: Number,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'refunded'],
      default: 'success',
    },
    ipAddress: String,
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

// ── Compound index for per-user analytics queries ─────────────────────────────
usageSchema.index({ user: 1, createdAt: -1 });
usageSchema.index({ team: 1, createdAt: -1 });

module.exports = mongoose.model('Usage', usageSchema);
