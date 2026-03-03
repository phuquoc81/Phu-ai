'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { getMyUsage, getDailyBreakdown } = require('../controllers/usageController');

router.use(authenticate, apiLimiter);

// GET /api/usage
router.get('/', getMyUsage);

// GET /api/usage/breakdown
router.get('/breakdown', getDailyBreakdown);

module.exports = router;
