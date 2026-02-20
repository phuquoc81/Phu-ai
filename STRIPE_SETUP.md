# Stripe Payment Integration – Setup Guide

## Overview

Phu AI uses [Stripe](https://stripe.com) to process payments securely.  
This document describes how to configure, run, and test the payment integration.

---

## Prerequisites

- Node.js 20+  
- A free [Stripe account](https://dashboard.stripe.com/register)  
- `npm` package manager

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your Stripe credentials.

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default `3000`) |
| `STRIPE_SECRET_KEY` | Secret API key from the Stripe Dashboard |
| `STRIPE_PUBLISHABLE_KEY` | Publishable API key shown in the frontend |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for webhook verification |
| `APP_URL` | Base URL of your deployment |

> ⚠️ **Never commit your real `.env` file.** It is already listed in `.gitignore`.

---

## Installation

```bash
npm install
```

---

## Running Locally

```bash
npm start
# or for development:
npm run dev
```

Open <http://localhost:3000> in your browser.

---

## Stripe Dashboard Setup

1. Log in to <https://dashboard.stripe.com>.
2. Copy your **Publishable key** and **Secret key** from  
   *Developers → API keys* into `.env`.
3. Create a webhook endpoint at  
   *Developers → Webhooks → Add endpoint*:
   - **Endpoint URL**: `https://your-domain.com/api/payments/webhook`
   - **Events to listen to**:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
4. Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET` in `.env`.

---

## API Endpoints

### `GET /api/payments/config`

Returns the Stripe publishable key for the frontend.

**Response**
```json
{ "publishableKey": "pk_test_..." }
```

---

### `POST /api/payments/create-intent`

Creates a Stripe PaymentIntent and a local transaction record.

**Request body**
```json
{
  "amount": 1000,
  "currency": "usd",
  "description": "Phu AI subscription",
  "metadata": { "userId": "u_123" }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `amount` | integer | ✅ | Smallest currency unit (e.g. cents). Minimum 50. |
| `currency` | string | | Default `"usd"`. Supported: `usd eur gbp aud cad jpy` |
| `description` | string | | Human-readable description |
| `metadata` | object | | Arbitrary key/value pairs stored in Stripe |

**Success response (201)**
```json
{
  "clientSecret": "pi_..._secret_...",
  "transactionId": "pay_...",
  "paymentIntentId": "pi_..."
}
```

**Error responses**  
`400` – Validation error  
`502` – Stripe API error

---

### `GET /api/payments`

Returns all local transaction records (newest first).

---

### `GET /api/payments/:transactionId`

Returns a single transaction by internal ID.

**Error**: `404` if not found.

---

### `POST /api/payments/webhook`

Stripe webhook receiver. Verifies the `Stripe-Signature` header using the
`STRIPE_WEBHOOK_SECRET`.  
Do **not** call this endpoint directly.

**Handled events**
| Event | Action |
|---|---|
| `payment_intent.succeeded` | Sets transaction status to `succeeded` |
| `payment_intent.payment_failed` | Sets transaction status to `failed` |
| `payment_intent.canceled` | Sets transaction status to `canceled` |

---

## Testing

### Unit / Integration Tests

```bash
npm test
```

### Manual Testing with Stripe Test Cards

| Card number | Scenario |
|---|---|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Insufficient funds (declined) |
| `4000 0025 0000 3155` | 3D Secure authentication required |

Use any future expiry date, any 3-digit CVC, and any ZIP.

### Webhook Testing with Stripe CLI

```bash
# Install the Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/payments/webhook
```

The CLI will print a webhook signing secret – set it as `STRIPE_WEBHOOK_SECRET` in `.env`.

---

## Security Considerations

- **API keys** are read from environment variables only; never hardcoded.
- **Webhook signature verification** uses `stripe.webhooks.constructEvent` to
  prevent spoofed events.
- **Rate limiting** is applied to all `/api/payments/*` routes (50 requests per
  15-minute window per IP).
- **PCI DSS**: Card data is collected by Stripe Elements (hosted on Stripe's
  servers) and never touches your backend.
- All amounts are validated server-side before reaching Stripe.

---

## Production Deployment (Azure)

Replace test keys with **live keys** from the Stripe Dashboard and configure
the environment variables in your Azure Web App settings.

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
