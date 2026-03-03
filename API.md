# API Reference

Base URL: `https://<your-backend-url>/api`

All protected endpoints require an `Authorization: Bearer <access_token>` header.

---

## Authentication

### POST /api/auth/register

Register a new user account.

**Request**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "S3cur3P@ss!"
}
```

**Response `201`**
```json
{
  "message": "Registration successful",
  "user": { "id": "64abc...", "name": "Jane Doe", "email": "jane@example.com" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

### POST /api/auth/login

**Request**
```json
{
  "email": "jane@example.com",
  "password": "S3cur3P@ss!"
}
```

**Response `200`**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "64abc...", "name": "Jane Doe", "email": "jane@example.com", "plan": "pro" }
}
```

---

### POST /api/auth/logout

Invalidates the refresh token. Requires valid access token.

**Response `200`**
```json
{ "message": "Logged out successfully" }
```

---

### POST /api/auth/refresh

Exchange a refresh token for a new access token.

**Request**
```json
{ "refreshToken": "eyJ..." }
```

**Response `200`**
```json
{ "accessToken": "eyJ..." }
```

---

## Stripe / Billing

### POST /api/stripe/checkout 🔒

Create a Stripe Checkout session for a subscription plan.

**Request**
```json
{ "priceId": "price_1ABC..." }
```

**Response `200`**
```json
{ "url": "https://checkout.stripe.com/pay/cs_test_..." }
```

---

### POST /api/stripe/portal 🔒

Create a Stripe Customer Portal session (manage subscription, invoices).

**Response `200`**
```json
{ "url": "https://billing.stripe.com/session/..." }
```

---

### POST /api/webhook

Stripe webhook endpoint. Must be called by Stripe only (validated via `STRIPE_WEBHOOK_SECRET`).

**Headers**
```
stripe-signature: t=...,v1=...
```

**Response `200`**
```json
{ "received": true }
```

---

## AI

### POST /api/ai/query 🔒

Submit a natural-language query to the AI engine.

**Request**
```json
{
  "prompt": "Explain the Riemann Hypothesis",
  "context": "mathematics"
}
```

**Response `200`**
```json
{
  "answer": "The Riemann Hypothesis states that...",
  "tokensUsed": 312,
  "model": "phu-ai-v1"
}
```

**Errors**

| Code | Meaning |
|---|---|
| `402` | Subscription required or quota exceeded |
| `429` | Rate limit hit |

---

## Team

### GET /api/team 🔒

List all members of the authenticated user's team.

**Response `200`**
```json
{
  "team": [
    { "id": "64abc...", "name": "Jane Doe", "email": "jane@example.com", "role": "owner" },
    { "id": "64def...", "name": "John Smith", "email": "john@example.com", "role": "member" }
  ]
}
```

---

### POST /api/team 🔒

Invite a new team member (owner only).

**Request**
```json
{ "email": "newmember@example.com", "role": "member" }
```

**Response `201`**
```json
{ "message": "Invitation sent", "inviteId": "64xyz..." }
```

---

## Usage

### GET /api/usage 🔒

Retrieve AI query usage stats for the current billing period.

**Response `200`**
```json
{
  "period": { "start": "2024-06-01T00:00:00Z", "end": "2024-06-30T23:59:59Z" },
  "queriesUsed": 47,
  "queriesLimit": 500,
  "tokensUsed": 14250
}
```

---

## Admin

### GET /api/admin/revenue 🔒 (admin role)

**Response `200`**
```json
{
  "mrr": 12400,
  "arr": 148800,
  "activeSubscriptions": 98,
  "newThisMonth": 14,
  "churnedThisMonth": 2
}
```

---

## Error Format

All errors follow this shape:

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE"
}
```

Common HTTP status codes:

| Status | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate email) |
| `429` | Rate limited |
| `500` | Internal server error |
