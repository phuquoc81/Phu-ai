'use strict';

/**
 * Web3 / PHU81 token payment verification.
 *
 * This module provides a framework for verifying on-chain token payments.
 * Full implementation requires a Web3 provider (e.g., ethers.js or viem)
 * configured with your RPC endpoint and PHU81 contract ABI.
 */

const User = require('../models/User');
const logger = require('../utils/logger');

const REQUIRED_CONFIRMATIONS = Number(process.env.WEB3_REQUIRED_CONFIRMATIONS) || 3;

// ── Verify a PHU81 token transaction and credit the user ──────────────────────
async function verifyTokenPayment(req, res, next) {
  try {
    const { txHash, amount, walletAddress } = req.body;

    // Placeholder: plug in your Web3 provider here.
    // Example with ethers.js:
    //   const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    //   const tx = await provider.getTransaction(txHash);
    //   const receipt = await provider.getTransactionReceipt(txHash);
    //   const latestBlock = await provider.getBlockNumber();
    //   const confirmations = latestBlock - receipt.blockNumber;
    //   if (confirmations < REQUIRED_CONFIRMATIONS) throw new Error('Not enough confirmations');
    //   Verify tx.to === PHU81_CONTRACT_ADDRESS, decoded transfer to our treasury, correct amount

    logger.info(
      { userId: req.user.id, txHash, amount, walletAddress },
      'PHU81 payment verification requested'
    );

    // Mock verification response – replace with real on-chain check
    const verified = false; // set true after on-chain verification

    if (!verified) {
      return res.status(400).json({
        error: 'Transaction could not be verified. Ensure it has enough confirmations.',
        requiredConfirmations: REQUIRED_CONFIRMATIONS,
      });
    }

    const creditsToGrant = Math.floor(Number(amount) * 10); // 1 PHU81 = 10 credits
    const user = await User.findById(req.user.id);
    user.credits.total += creditsToGrant;
    await user.save();

    res.json({
      message: 'Payment verified and credits applied',
      creditsGranted: creditsToGrant,
      newTotal: user.credits.total,
    });
  } catch (err) {
    next(err);
  }
}

// ── Get wallet info for payment ───────────────────────────────────────────────
async function getPaymentInfo(req, res, next) {
  try {
    res.json({
      contractAddress: process.env.PHU81_CONTRACT_ADDRESS || null,
      treasuryAddress: process.env.PHU81_TREASURY_ADDRESS || null,
      network: process.env.WEB3_NETWORK || 'mainnet',
      rateCreditsPerToken: 10,
      requiredConfirmations: REQUIRED_CONFIRMATIONS,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { verifyTokenPayment, getPaymentInfo };
