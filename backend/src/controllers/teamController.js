'use strict';

const crypto = require('crypto');
const Team = require('../models/Team');
const User = require('../models/User');
const logger = require('../utils/logger');

// ── Create a new team ─────────────────────────────────────────────────────────
async function createTeam(req, res, next) {
  try {
    const { name, plan = 'free' } = req.body;

    const existing = await Team.findOne({ owner: req.user.id });
    if (existing) {
      return res.status(409).json({ error: 'You already own a team' });
    }

    const team = await Team.create({
      name,
      plan,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'owner' }],
    });

    await User.findByIdAndUpdate(req.user.id, {
      team: team._id,
      role: 'team_owner',
    });

    res.status(201).json({ team });
  } catch (err) {
    next(err);
  }
}

// ── Get team details ──────────────────────────────────────────────────────────
async function getTeam(req, res, next) {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('owner', 'name email')
      .populate('members.user', 'name email role');

    if (!team) return res.status(404).json({ error: 'Team not found' });

    const isMember = team.members.some((m) => m.user._id.toString() === req.user.id);
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ team });
  } catch (err) {
    next(err);
  }
}

// ── Invite a member ───────────────────────────────────────────────────────────
async function inviteMember(req, res, next) {
  try {
    const { email, role = 'member' } = req.body;
    const team = await Team.findOne({ owner: req.user.id });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    if (team.members.length >= team.maxMembers) {
      return res.status(403).json({ error: 'Team member limit reached' });
    }

    const alreadyInvited = team.pendingInvites.some((i) => i.email === email.toLowerCase());
    if (alreadyInvited) {
      return res.status(409).json({ error: 'Invite already pending for this email' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    team.pendingInvites.push({ email: email.toLowerCase(), role, token, expiresAt });
    await team.save();

    // TODO: send invite email with token
    logger.info({ email, teamId: team._id }, 'Team invite created');

    res.status(201).json({ message: 'Invite sent', token });
  } catch (err) {
    next(err);
  }
}

// ── Accept an invite ──────────────────────────────────────────────────────────
async function acceptInvite(req, res, next) {
  try {
    const { token } = req.params;

    const team = await Team.findOne({ 'pendingInvites.token': token });
    if (!team) return res.status(404).json({ error: 'Invalid or expired invite' });

    const invite = team.pendingInvites.find((i) => i.token === token);
    if (!invite || invite.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invite has expired' });
    }

    const user = await User.findById(req.user.id);
    if (user.email !== invite.email) {
      return res.status(403).json({ error: 'Invite email does not match your account' });
    }

    team.members.push({ user: req.user.id, role: invite.role });
    team.pendingInvites = team.pendingInvites.filter((i) => i.token !== token);
    await team.save();

    user.team = team._id;
    user.role = 'team_member';
    await user.save();

    res.json({ message: 'Joined team successfully', team: { id: team._id, name: team.name } });
  } catch (err) {
    next(err);
  }
}

// ── Remove a member ───────────────────────────────────────────────────────────
async function removeMember(req, res, next) {
  try {
    const { memberId } = req.params;
    const team = await Team.findOne({ owner: req.user.id });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    if (memberId === req.user.id) {
      return res.status(400).json({ error: 'Owner cannot remove themselves' });
    }

    const memberIndex = team.members.findIndex((m) => m.user.toString() === memberId);
    if (memberIndex === -1) return res.status(404).json({ error: 'Member not found' });

    team.members.splice(memberIndex, 1);
    await team.save();

    await User.findByIdAndUpdate(memberId, { $unset: { team: '' }, role: 'user' });

    res.json({ message: 'Member removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTeam, getTeam, inviteMember, acceptInvite, removeMember };
