'use strict';

/**
 * In-memory payment transaction store.
 *
 * In production, replace this with a real database (e.g. MongoDB, PostgreSQL).
 * Each record follows the schema below.
 *
 * Schema:
 *   id              {string}  - Internal record ID (uuid-like, prefixed with "pay_")
 *   paymentIntentId {string}  - Stripe PaymentIntent ID
 *   amount          {number}  - Amount in the smallest currency unit (e.g. cents)
 *   currency        {string}  - ISO 4217 currency code, lowercase (e.g. "usd")
 *   status          {string}  - "pending" | "succeeded" | "failed" | "canceled"
 *   description     {string}  - Human-readable description
 *   metadata        {object}  - Arbitrary key/value pairs forwarded to Stripe
 *   createdAt       {Date}
 *   updatedAt       {Date}
 */

const transactions = new Map();
let counter = 0;

function generateId() {
  counter += 1;
  return `pay_${Date.now()}_${counter}`;
}

/**
 * Create a new payment transaction record.
 * @param {object} data
 * @returns {object} The created transaction
 */
function createTransaction(data) {
  const now = new Date();
  const record = {
    id: generateId(),
    paymentIntentId: data.paymentIntentId || null,
    amount: data.amount,
    currency: (data.currency || 'usd').toLowerCase(),
    status: 'pending',
    description: data.description || '',
    metadata: data.metadata || {},
    createdAt: now,
    updatedAt: now,
  };
  transactions.set(record.id, record);
  return record;
}

/**
 * Find a transaction by its internal ID.
 * @param {string} id
 * @returns {object|undefined}
 */
function findById(id) {
  return transactions.get(id);
}

/**
 * Find a transaction by Stripe PaymentIntent ID.
 * @param {string} paymentIntentId
 * @returns {object|undefined}
 */
function findByPaymentIntentId(paymentIntentId) {
  for (const tx of transactions.values()) {
    if (tx.paymentIntentId === paymentIntentId) return tx;
  }
  return undefined;
}

/**
 * Update a transaction's status (and optionally its paymentIntentId).
 * @param {string} id - Internal transaction ID
 * @param {object} updates - Fields to update
 * @returns {object|null} Updated record, or null if not found
 */
function updateTransaction(id, updates) {
  const record = transactions.get(id);
  if (!record) return null;
  Object.assign(record, updates, { updatedAt: new Date() });
  return record;
}

/**
 * Return all transactions as an array (newest first).
 * @returns {object[]}
 */
function listTransactions() {
  return Array.from(transactions.values()).sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}

module.exports = {
  createTransaction,
  findById,
  findByPaymentIntentId,
  updateTransaction,
  listTransactions,
};
