'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { validate, body } = require('../middleware/validation');
const Usage = require('../models/Usage');
const User = require('../models/User');
const logger = require('../utils/logger');

const AI_CREDIT_COST = {
  text: 1,
  image: 10,
  audio: 5,
  code: 2,
};

// POST /api/ai/query – generic AI query with credit deduction
router.post(
  '/query',
  authenticate,
  aiLimiter,
  [
    body('prompt').trim().notEmpty().withMessage('Prompt is required').isLength({ max: 4000 }),
    body('type')
      .optional()
      .isIn(['text', 'image', 'audio', 'code'])
      .withMessage('Invalid query type'),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { prompt, type = 'text', model = 'gpt-4o' } = req.body;
      const creditCost = AI_CREDIT_COST[type] ?? 1;
      const startMs = Date.now();

      const user = await User.findById(req.user.id);
      await user.deductCredits(creditCost);

      // ── Plug in your AI provider here ────────────────────────────────────
      // Example: const completion = await openai.chat.completions.create({ ... });
      // const result = completion.choices[0].message.content;
      const result = `[AI response placeholder for: "${prompt.slice(0, 50)}"]`;
      const durationMs = Date.now() - startMs;

      // type is 'text'|'image'|'audio'|'code', matching the Usage action enum prefix
      await Usage.create({
        user: req.user.id,
        team: user.team || undefined,
        action: `ai_${type}`,
        credits: creditCost,
        metadata: { model, durationMs },
        ipAddress: req.ip,
      });

      logger.info({ userId: req.user.id, type, creditCost }, 'AI query processed');
      res.json({ result, creditsUsed: creditCost, remainingCredits: user.credits.available });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
