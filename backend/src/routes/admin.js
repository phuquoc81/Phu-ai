'use strict';

const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Usage = require('../models/Usage');

router.use(authenticate, requireRole('admin'), apiLimiter);

// GET /api/admin/stats – high-level revenue & usage dashboard
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeSubscriptions,
      totalRevenue,
      creditsUsedToday,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ subscriptionStatus: 'active' }),
      Invoice.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } },
      ]),
      Usage.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
        { $group: { _id: null, total: { $sum: '$credits' } } },
      ]),
    ]);

    res.json({
      totalUsers,
      activeSubscriptions,
      totalRevenueCents: totalRevenue[0]?.total ?? 0,
      creditsUsedToday: creditsUsedToday[0]?.total ?? 0,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users – paginated user list
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = search
      ? { $or: [{ email: new RegExp(search, 'i') }, { name: new RegExp(search, 'i') }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('name email role plan subscriptionStatus credits createdAt lastLoginAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ users, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/revenue – monthly revenue breakdown
router.get('/revenue', async (req, res, next) => {
  try {
    const months = Math.min(Number(req.query.months) || 12, 24);
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const data = await Invoice.aggregate([
      { $match: { status: 'paid', paidAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$paidAt' } },
          revenue: { $sum: '$amountPaid' },
          invoiceCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
