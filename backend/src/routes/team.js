'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validate, emailField, body, mongoIdParam } = require('../middleware/validation');
const {
  createTeam,
  getTeam,
  inviteMember,
  acceptInvite,
  removeMember,
} = require('../controllers/teamController');

router.use(authenticate, apiLimiter);

// POST /api/team
router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Team name is required'), validate],
  createTeam
);

// GET /api/team/:teamId
router.get('/:teamId', [mongoIdParam('teamId'), validate], getTeam);

// POST /api/team/invite
router.post(
  '/invite',
  [
    emailField('email'),
    body('role').optional().isIn(['admin', 'member']),
    validate,
  ],
  inviteMember
);

// POST /api/team/invite/accept/:token
router.post('/invite/accept/:token', acceptInvite);

// DELETE /api/team/members/:memberId
router.delete(
  '/members/:memberId',
  [mongoIdParam('memberId'), validate],
  removeMember
);

module.exports = router;
