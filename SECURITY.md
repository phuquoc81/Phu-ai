# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability in Bisswiz, please **do not** open a public GitHub issue.
Instead, email **security@bisswiz.com** with:

1. A description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. (Optional) Suggested fix

You will receive a response within **48 hours**. We aim to release a fix within **7 days** of confirmation.

---

## Security Controls

### Transport Security

- All production traffic is served over **HTTPS** with TLS 1.2+ only.
- **HTTP Strict Transport Security (HSTS)** is enforced with a `max-age` of one year,
  `includeSubDomains`, and `preload`.
- Weak cipher suites (RC4, DES, 3DES, NULL) are disabled. Only ECDHE and AES-GCM
  suites are permitted.

### HTTP Security Headers

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | Restricts scripts/frames to self + Stripe domains |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disables camera, mic, geolocation; restricts Payment API |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |

### Payment Security

#### Stripe
- Payments are processed via **Stripe** (PCI-DSS Level 1 certified).
- Sensitive card data **never touches** our servers – Stripe.js tokenises card details in the browser.
- All Stripe webhook events are verified using `stripe.webhooks.constructEvent()` with an
  HMAC-SHA256 signature before any business logic runs.

#### Bank Transfer
- Bank transfer webhooks are authenticated with **HMAC-SHA256** (`X-Bank-Signature` header).
- Signature comparison uses `crypto.timingSafeEqual` to prevent timing attacks.
- Recipient `accountNumber` is validated against a strict regex (`/^[0-9A-Z\-]{6,34}$/`) and
  `routingNumber` against `/^[0-9]{9}$/`.
- Account names are HTML-escaped to prevent stored XSS.

### Rate Limiting

| Scope | Limit |
|-------|-------|
| `/api/*` | 100 requests / 15 min per IP |
| `/payments/*` | 10 requests / 15 min per IP |

### Input Validation

All payment endpoints use `express-validator` to enforce:
- Type correctness (integer amounts, ISO-4217 currency codes, UUID game IDs)
- Length and format constraints (account numbers, routing numbers, account names)
- Requests failing validation receive **HTTP 422** with an error array.

### CORS

Only origins listed in the `ALLOWED_ORIGINS` environment variable are permitted.
All other origins receive **HTTP 403**.

### Dependency Management

- Production dependencies are kept minimal (Helmet, Stripe SDK, express-validator, cors,
  express-rate-limit).
- `npm audit` is run on every CI build. High-severity production vulnerabilities block deployment.
