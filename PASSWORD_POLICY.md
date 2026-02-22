# Password Security Policy

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Table of Contents

1. [Purpose and Scope](#purpose-and-scope)
2. [Password Requirements](#password-requirements)
3. [Password Prohibited Practices](#password-prohibited-practices)
4. [Password Storage](#password-storage)
5. [Password Transmission](#password-transmission)
6. [Password Reset and Recovery](#password-reset-and-recovery)
7. [Breached Password Detection](#breached-password-detection)
8. [Multi-Factor Authentication](#multi-factor-authentication)
9. [Implementation Guidelines](#implementation-guidelines)

---

## 1. Purpose and Scope

This policy defines password security requirements for the Phu-ai web application. It covers:
- User account passwords
- Service account credentials
- API keys and tokens
- Administrative credentials

The goal is to ensure passwords provide adequate protection against unauthorized access while remaining usable for legitimate users.

### Alignment with NIST Guidelines

This policy follows [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) digital identity guidelines, which prioritize:
- Password length over complexity
- Breached password detection over forced rotation
- User-friendly requirements that improve security behavior

---

## 2. Password Requirements

### 2.1 User Account Passwords

| Requirement              | Minimum Standard           | Recommended              |
| ------------------------ | -------------------------- | ------------------------ |
| Minimum length           | 12 characters              | 16+ characters           |
| Maximum length           | 128 characters             | No upper limit           |
| Character requirements   | No mandatory complexity    | Mix of character types   |
| Allowed characters       | All printable ASCII + Unicode | Same                   |
| Space characters         | ✅ Allowed                  | ✅ Encouraged in passphrases |
| Unicode characters       | ✅ Allowed                  | ✅ Supported              |

**Note:** Following NIST guidelines, we do not mandate complex character requirements (uppercase, lowercase, numbers, symbols). Instead, we encourage long passphrases, which are more secure and easier to remember.

### 2.2 Administrative Account Passwords

| Requirement              | Standard                   |
| ------------------------ | -------------------------- |
| Minimum length           | 16 characters              |
| Multi-factor auth        | **Required**               |
| Password manager use     | **Required**               |
| Unique per service       | **Required**               |

### 2.3 Service Account / API Credentials

| Requirement              | Standard                   |
| ------------------------ | -------------------------- |
| Minimum length           | 32 characters              |
| Generation method        | Cryptographically random   |
| Human-memorable          | Not required               |
| Rotation                 | Every 90 days              |

---

## 3. Password Prohibited Practices

### Users Must NOT Use

- Passwords from the list of commonly used passwords (top 10,000)
- Passwords containing their username, email, or service name
- Passwords that have appeared in known data breaches
- Passwords reused from other services
- Sequential patterns: `12345678`, `abcdefgh`
- Keyboard patterns: `qwerty`, `asdfghjkl`
- Repeated characters: `aaaaaaaa`, `11111111`
- Common words + numbers: `password123`, `admin2026`
- Personal information: birth dates, names, addresses

### Application Must NOT Do

- Store passwords in plain text
- Log passwords (even in debug mode)
- Transmit passwords over unencrypted connections
- Send passwords in email
- Truncate passwords beyond maximum length
- Perform case-insensitive password comparison
- Use MD5 or SHA1 for password hashing

---

## 4. Password Storage

### 4.1 Hashing Requirements

| Algorithm    | Status        | Configuration                        |
| ------------ | ------------- | ------------------------------------ |
| Argon2id     | ✅ Recommended | m=64MB, t=3, p=4 (or higher)         |
| bcrypt       | ✅ Acceptable  | Cost factor ≥ 12                     |
| scrypt       | ✅ Acceptable  | N=16384, r=8, p=1 (or higher)        |
| PBKDF2       | ⚠️ Acceptable  | SHA-256, 600,000+ iterations         |
| SHA-256/512  | ❌ Prohibited  | Too fast, vulnerable to brute force   |
| MD5          | ❌ Prohibited  | Broken                               |
| SHA-1        | ❌ Prohibited  | Broken                               |
| Plain text   | ❌ Prohibited  | Never store plain text passwords     |

### 4.2 Salt Requirements

- Each password must use a unique, cryptographically random salt
- Minimum salt length: 16 bytes (128 bits)
- Salts are automatically handled by bcrypt/Argon2

### 4.3 Pepper (Optional Enhancement)

For high-security applications, consider adding a pepper:
- Server-side secret value added before hashing
- Stored in configuration, not database
- Provides additional protection if database is compromised

---

## 5. Password Transmission

### 5.1 Over-the-Wire Security

- Passwords transmitted only over HTTPS (TLS 1.2+)
- Never in URL query parameters
- Never in HTTP headers except Authorization
- Never in log files
- Application should use POST, not GET for login forms

### 5.2 Password in Memory

- Zero out password strings after use when possible
- Avoid storing passwords in session state
- Clear password fields from memory as soon as the hash is computed

---

## 6. Password Reset and Recovery

### 6.1 Password Reset Process

1. User requests password reset
2. System generates a cryptographically secure reset token
3. Token sent to user's verified email address
4. Token is single-use and expires in **1 hour**
5. Token is stored as a hash in the database
6. User clicks link, enters new password
7. Old password hash is replaced with new hash
8. **All active sessions are invalidated**
9. User notified via email of password change

### 6.2 Reset Token Security

| Requirement          | Standard                                   |
| -------------------- | ------------------------------------------ |
| Token length         | Minimum 256 bits (32 bytes) from CSPRNG    |
| Token storage        | Hashed with SHA-256 (not plain text)       |
| Token expiry         | 1 hour from generation                     |
| Token reuse          | Single-use only                            |
| URL encoding         | URL-safe Base64 encoding                   |

### 6.3 Security Notifications

Users receive email notifications for:
- Password reset requested (even if they didn't initiate)
- Password successfully changed
- Failed login attempts (configurable threshold)
- New device login

---

## 7. Breached Password Detection

### 7.1 Have I Been Pwned Integration

New and changed passwords are checked against known breached password databases:

```javascript
const { pwnedPassword } = require('hibp');

async function isPasswordBreached(password) {
  try {
    const pwnedCount = await pwnedPassword(password);
    return pwnedCount > 0;
  } catch (error) {
    // If service unavailable, log warning but don't block
    console.warn('Breach check unavailable:', error.message);
    return false;
  }
}
```

**Note:** We use the k-anonymity model – only the first 5 characters of the SHA-1 hash are sent to the external service. The full hash never leaves the application.

### 7.2 Common Password List

Maintain a local list of the most common passwords and check against it:
- Top 10,000 most common passwords
- Updated regularly from public datasets
- Check performed locally (no external request)

---

## 8. Multi-Factor Authentication

Password alone is insufficient for high-value accounts. See [AUTHENTICATION_POLICY.md](AUTHENTICATION_POLICY.md) for MFA requirements.

**Password + MFA recommended for all users.**  
**Password + MFA required for administrators.**

---

## 9. Implementation Guidelines

### Password Validation (Node.js)

```javascript
const { pwnedPassword } = require('hibp');
const bcrypt = require('bcrypt');
const zxcvbn = require('zxcvbn'); // Password strength estimator

const COMMON_PASSWORDS = require('./common-passwords.json'); // Top 10k list

async function validatePassword(password, userInputs = []) {
  const errors = [];
  
  // 1. Length check
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }
  
  // 2. Common password check
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more unique password');
  }
  
  // 3. Strength check using zxcvbn
  const strength = zxcvbn(password, userInputs);
  if (strength.score < 2) {
    errors.push('Password is too weak. ' + strength.feedback.suggestions.join(' '));
  }
  
  // 4. Breached password check
  const breached = await isPasswordBreached(password);
  if (breached) {
    errors.push('This password has appeared in data breaches. Please choose a different password');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    strength: strength.score,
  };
}

// Password hashing
const SALT_ROUNDS = 12; // bcrypt cost factor

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
```

### Password Strength Indicator

Provide real-time password strength feedback:
- Use a strength meter (e.g., zxcvbn library)
- Show specific suggestions for improvement
- Visual indicator (weak/fair/good/strong)
- Do NOT show requirements as checkboxes (gameable)

---

## Version History

| Version | Date       | Changes                           |
| ------- | ---------- | --------------------------------- |
| 1.0.0   | 2026-02-22 | Initial password policy created   |
