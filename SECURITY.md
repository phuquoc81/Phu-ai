# Security Policy

## Reporting a Vulnerability

**Please do NOT open a public GitHub Issue for security vulnerabilities.**

Report vulnerabilities by emailing **security@phu-ai.com** with:

1. A description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (optional)

You will receive an acknowledgement within **48 hours** and a resolution timeline within **5 business days**.

We follow responsible disclosure: please give us reasonable time to address the issue before making it public.

---

## Supported Versions

| Version | Supported |
|---|---|
| Latest (`main`) | ✅ |
| Older releases | ❌ (please upgrade) |

---

## Security Features Implemented

### Authentication
- JWT access tokens (short-lived: 15 minutes)
- Refresh token rotation (invalidated on use)
- Passwords hashed with bcrypt (min 12 rounds)
- Rate limiting on auth endpoints

### API
- Helmet.js HTTP security headers
- CORS restricted to known origins (`FRONTEND_URL`)
- Request size limits enforced
- Input validation and sanitisation on all endpoints

### Stripe Webhooks
- Signature verification via `STRIPE_WEBHOOK_SECRET` on every webhook event
- Raw body parsing preserved for signature checks

### Smart Contract
- OpenZeppelin audited contracts (5.x)
- Pausable circuit-breaker for emergency stops
- Hard supply cap enforced on-chain
- Owner key should be transferred to a multisig after deployment

### Infrastructure
- Environment variables never committed (`.gitignore`, `.env.example`)
- Dependencies audited in CI (`npm audit --audit-level=high`)
- CodeQL static analysis on every push/PR
- Dependency review on pull requests

---

## CVE Response Process

1. Vulnerability reported privately
2. Team triages and confirms within 48 hours
3. Fix developed on a private branch
4. Fix reviewed and tested
5. Patched release published
6. CVE advisory opened (if applicable) after users have had time to upgrade

---

## Dependency Updates

We use GitHub Dependabot to receive automated PRs for dependency updates. Critical security updates are merged as soon as CI passes.
