# Authentication and Authorization Policy

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Requirements](#authentication-requirements)
3. [Multi-Factor Authentication](#multi-factor-authentication)
4. [OAuth and Third-Party Authentication](#oauth-and-third-party-authentication)
5. [Session Management](#session-management)
6. [Authorization Framework](#authorization-framework)
7. [Access Control Implementation](#access-control-implementation)
8. [Token Management](#token-management)
9. [Account Security Policies](#account-security-policies)
10. [Implementation Guidelines](#implementation-guidelines)

---

## 1. Overview

This policy establishes authentication and authorization requirements for the Phu-ai web application. Strong authentication and authorization controls are fundamental to protecting user accounts and application data.

### Scope

- All user-facing authentication mechanisms
- API authentication
- OAuth integrations
- Session management
- Access control enforcement

---

## 2. Authentication Requirements

### 2.1 Minimum Authentication Standards

| Requirement                              | Standard                                   |
| ---------------------------------------- | ------------------------------------------ |
| Password hashing algorithm               | bcrypt (cost factor ≥ 12) or Argon2id      |
| Minimum password length                  | 12 characters (see PASSWORD_POLICY.md)     |
| Maximum password length                  | 128 characters (no upper limit prevents DoS)|
| Password transmission                    | HTTPS only, never in URL parameters        |
| Failed login handling                    | Progressive delays, account lockout        |
| Brute force protection                   | Rate limiting + CAPTCHA after 5 failures   |

### 2.2 Account Lockout Policy

| Threshold              | Action                                        | Duration         |
| ---------------------- | --------------------------------------------- | ---------------- |
| 5 failed attempts      | CAPTCHA required                              | Until solved     |
| 10 failed attempts     | Temporary lockout                             | 15 minutes       |
| 20 failed attempts     | Extended lockout                              | 1 hour           |
| 30 failed attempts     | Account locked, manual unlock required        | Until unlocked   |

**IP-Based Rate Limiting:**
- Maximum 20 failed login attempts per IP per hour
- Progressive CAPTCHA requirements
- Automatic blocking of IPs with excessive failed attempts

### 2.3 Login Security Requirements

- Login page served over HTTPS only
- No sensitive information in query strings
- User enumeration prevention (consistent responses for valid/invalid accounts)
- Login activity notification to account email
- Suspicious activity alerts (new device, unusual location)

---

## 3. Multi-Factor Authentication

### 3.1 MFA Support

| Method                                | Support Level  | Security Level  |
| ------------------------------------- | -------------- | --------------- |
| TOTP (e.g., Google Authenticator)     | ✅ Supported    | High            |
| SMS OTP                               | 🟡 Optional     | Medium          |
| Email OTP                             | 🟡 Optional     | Medium          |
| Hardware security keys (WebAuthn/FIDO2) | 🟡 Recommended | Very High       |
| Backup codes                          | ✅ Supported    | Medium          |

### 3.2 MFA Requirements

| User Type             | MFA Requirement    |
| --------------------- | ------------------ |
| Standard users        | Strongly recommended |
| Administrative users  | Required           |
| API integrations      | Required (tokens)  |

### 3.3 MFA Implementation Requirements

- TOTP must use RFC 6238 standard (30-second windows)
- Allow ±1 window drift for clock skew
- Backup codes: 8-10 single-use codes, 12+ characters each
- Secure storage of MFA secrets (encrypted at rest)
- Recovery process requires strong identity verification

---

## 4. OAuth and Third-Party Authentication

### 4.1 Supported OAuth Providers

| Provider    | Scope Required        | Notes                                    |
| ----------- | --------------------- | ---------------------------------------- |
| GitHub      | `user:email`, `read:user` | Primary OAuth provider              |
| Google      | `email`, `profile`    | Optional, if implemented                 |

### 4.2 OAuth Security Requirements

- Use **PKCE** (Proof Key for Code Exchange) for all OAuth flows
- Validate **state parameter** to prevent CSRF
- Validate **redirect URIs** strictly (no open redirects)
- Store tokens securely (never in localStorage, use httpOnly cookies)
- Refresh tokens securely and rotate on use
- Validate `iss`, `aud`, `exp` claims in ID tokens

### 4.3 OAuth Implementation Checklist

- [ ] Use authorization code flow (not implicit flow)
- [ ] PKCE implemented
- [ ] State parameter validated
- [ ] Redirect URI whitelist enforced
- [ ] Access tokens stored in httpOnly, Secure cookies
- [ ] Token expiry enforced
- [ ] Token refresh implemented
- [ ] Token revocation on logout

---

## 5. Session Management

### 5.1 Session Security Requirements

| Requirement                          | Standard                                        |
| ------------------------------------ | ----------------------------------------------- |
| Session ID generation                | Cryptographically secure random (≥ 128 bits)    |
| Session ID transmission              | Secure, httpOnly cookies only                   |
| Session timeout (idle)               | 30 minutes (configurable)                       |
| Session timeout (absolute)           | 24 hours maximum                                |
| Session invalidation on logout       | Immediate, server-side                          |
| Session invalidation on password change | All existing sessions invalidated             |
| Concurrent session management        | Configurable (default: allow multiple)          |

### 5.2 Cookie Security Attributes

All session cookies must have:

```
Set-Cookie: session=<value>; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=1800
```

| Attribute      | Value           | Reason                                        |
| -------------- | --------------- | --------------------------------------------- |
| `Secure`       | Required        | Cookie only sent over HTTPS                   |
| `HttpOnly`     | Required        | Prevents JavaScript access (XSS protection)   |
| `SameSite`     | `Strict`        | CSRF protection                               |
| `Path`         | `/`             | Appropriate scope                             |
| `Max-Age`      | Session timeout | Automatic expiry                              |

### 5.3 Session Invalidation Triggers

Sessions must be invalidated when:
- User explicitly logs out
- User password is changed
- User account is deactivated
- Suspicious activity is detected
- Session exceeds idle timeout
- Session exceeds absolute timeout
- MFA is re-enrolled

---

## 6. Authorization Framework

### 6.1 Access Control Model

Phu-ai uses **Role-Based Access Control (RBAC)**:

| Role            | Description                                          | Permissions                           |
| --------------- | ---------------------------------------------------- | ------------------------------------- |
| `guest`         | Unauthenticated user                                 | Access public content only            |
| `user`          | Authenticated standard user                          | Use core AI features, manage own data |
| `premium_user`  | Paid subscription user                               | All user permissions + premium features |
| `admin`         | Platform administrator                               | All permissions + user management     |
| `superadmin`    | System administrator                                 | All permissions + system configuration |

### 6.2 Authorization Principles

- **Deny by default**: Access denied unless explicitly granted
- **Principle of least privilege**: Users have minimum necessary permissions
- **Separation of duties**: Critical operations require multiple authorizations
- **Defense in depth**: Multiple layers of authorization checks

---

## 7. Access Control Implementation

### 7.1 Server-Side Enforcement

Authorization must always be enforced **server-side**:

```javascript
// Example middleware for route protection
function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles.includes(role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Apply to routes
app.get('/api/admin/users', requireAuth, requireRole('admin'), (req, res) => {
  // Admin-only route
});
```

### 7.2 Resource-Level Authorization

Verify user has access to specific resources:

```javascript
async function getUserResource(req, res) {
  const resourceId = req.params.id;
  const resource = await Resource.findById(resourceId);
  
  // Always verify ownership, never trust client-side claims
  if (!resource || resource.userId !== req.user.id) {
    return res.status(404).json({ error: 'Resource not found' }); // 404 prevents enumeration
  }
  
  res.json(resource);
}
```

---

## 8. Token Management

### 8.1 JWT (JSON Web Token) Requirements

| Requirement                     | Standard                                            |
| ------------------------------- | --------------------------------------------------- |
| Signing algorithm               | RS256 or ES256 (asymmetric preferred)               |
| Access token expiry             | 15 minutes maximum                                  |
| Refresh token expiry            | 7 days (rotating)                                   |
| Token storage                   | httpOnly cookies (not localStorage)                 |
| Token validation                | Verify signature, expiry, issuer, audience          |

### 8.2 API Keys

| Requirement                     | Standard                                            |
| ------------------------------- | --------------------------------------------------- |
| Key generation                  | Cryptographically secure random (256 bits)         |
| Key storage                     | Hashed in database (never plaintext)               |
| Key transmission                | HTTPS only, in Authorization header                 |
| Key rotation                    | Supported, old keys expire after grace period       |
| Key revocation                  | Immediate effect                                    |

---

## 9. Account Security Policies

### 9.1 Account Registration

- Email verification required
- Rate limiting on registration endpoint
- CAPTCHA for suspicious patterns
- Disposable email domains blocked (optional)

### 9.2 Account Recovery

- Password reset via verified email only
- Reset tokens: single-use, expire in 1 hour
- Account recovery questions: discouraged (insecure)
- Identity verification required for admin account recovery

### 9.3 Account Deactivation

On account deactivation:
- Immediate session invalidation
- Access tokens revoked
- OAuth delegations revoked
- Data retained per [DATA_PROTECTION_POLICY.md](DATA_PROTECTION_POLICY.md) retention schedule

---

## 10. Implementation Guidelines

### Node.js Authentication Stack

```javascript
// Recommended packages
const bcrypt = require('bcrypt'); // Password hashing
const jwt = require('jsonwebtoken'); // JWT tokens
const passport = require('passport'); // Auth middleware

// Password hashing
const SALT_ROUNDS = 12;
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Session configuration
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET, // Strong random secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JavaScript access
    sameSite: 'strict', // CSRF protection
    maxAge: 1800000,   // 30 minutes
  },
  store: new RedisStore({ client: redisClient }), // Server-side storage
}));
```

---

## Version History

| Version | Date       | Changes                                      |
| ------- | ---------- | -------------------------------------------- |
| 1.0.0   | 2026-02-22 | Initial authentication policy created        |
