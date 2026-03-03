'use strict';

const mongoose = require('mongoose');
const Usage = require('../models/Usage');
const User = require('../models/User');

// ── Log and deduct credits for an AI action ───────────────────────────────────
async function logUsage(req, res, next) {
  try {
    const { action, credits, metadata } = req.body;
    const user = await User.findById(req.user.id);

    await user.deductCredits(credits);

    const record = await Usage.create({
      user: req.user.id,
      team: user.team || undefined,
      action,
      credits,
      metadata,
      ipAddress: req.ip,
    });

    res.status(201).json({ record, remainingCredits: user.credits.available });
  } catch (err) {
    next(err);
  }
}

// ── Usage summary for the authenticated user ──────────────────────────────────
async function getMyUsage(req, res, next) {
  try {
    const { from, to, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user.id };

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [records, total] = await Promise.all([
      Usage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Usage.countDocuments(filter),
    ]);

    // Aggregate totals
    const [agg] = await Usage.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCredits: { $sum: '$credits' },
          totalRequests: { $sum: 1 },
        },
      },
    ]);

    res.json({
      records,
      totals: agg || { totalCredits: 0, totalRequests: 0 },
      pagination: { page: Number(page), limit: Number(limit), total },
    });
  } catch (err) {
    next(err);
  }
}

// ── Daily breakdown chart data ────────────────────────────────────────────────
async function getDailyBreakdown(req, res, next) {
  try {
    const days = Math.min(Number(req.query.days) || 30, 90);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await Usage.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            action: '$action',
          },
          credits: { $sum: '$credits' },
          requests: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

module.exports = { logUsage, getMyUsage, getDailyBreakdown };
