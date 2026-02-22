# Encryption Policy

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Table of Contents

1. [Overview](#overview)
2. [Encryption Standards](#encryption-standards)
3. [Data in Transit Encryption](#data-in-transit-encryption)
4. [Data at Rest Encryption](#data-at-rest-encryption)
5. [Key Management](#key-management)
6. [Cryptographic Algorithm Requirements](#cryptographic-algorithm-requirements)
7. [Certificate Requirements](#certificate-requirements)
8. [Prohibited Algorithms](#prohibited-algorithms)
9. [Implementation Guidelines](#implementation-guidelines)

---

## 1. Overview

This policy defines the encryption standards and requirements for the Phu-ai web application. Encryption is a fundamental control for protecting data confidentiality and integrity.

### Scope

This policy covers:
- Encryption of data in transit (network communications)
- Encryption of data at rest (databases, file storage)
- Cryptographic key management
- Approved and prohibited cryptographic algorithms

### Regulatory Alignment

This policy aligns with:
- **NIST SP 800-57** – Recommendation for Key Management
- **NIST SP 800-131A** – Transitioning the Use of Cryptographic Algorithms
- **GDPR Article 32** – Security of processing (encryption as appropriate measure)
- **PCI DSS** – Requirement 3 & 4 (encryption standards)

---

## 2. Encryption Standards

### Summary of Required Standards

| Data Category            | In Transit              | At Rest                  |
| ------------------------ | ----------------------- | ------------------------ |
| All network traffic      | TLS 1.2+ required       | N/A                      |
| User credentials         | TLS 1.2+                | bcrypt/Argon2id          |
| User personal data       | TLS 1.2+                | AES-256-GCM              |
| Session tokens           | TLS 1.2+, httpOnly cookie | N/A (short-lived)      |
| API keys                 | TLS 1.2+                | SHA-256 hash             |
| Database backups         | TLS 1.2+                | AES-256-GCM              |
| Configuration secrets    | N/A                     | Azure Key Vault (HSM-backed) |

---

## 3. Data in Transit Encryption

### 3.1 TLS Requirements

| Requirement              | Standard                                  |
| ------------------------ | ----------------------------------------- |
| Protocol versions        | TLS 1.2 minimum, TLS 1.3 preferred        |
| Deprecated protocols     | TLS 1.0, TLS 1.1, SSL 2.0, SSL 3.0 – **prohibited** |
| Certificate validity     | Issued by trusted CA, not expired          |
| Certificate type         | DV minimum for all domains                |
| Key size                 | RSA ≥ 2048 bits or ECDSA ≥ 256 bits       |
| Forward secrecy          | Required (ECDHE/DHE key exchange)         |
| OCSP stapling            | Enabled                                   |

### 3.2 Approved TLS Cipher Suites

**TLS 1.3 (preferred):**
- `TLS_AES_256_GCM_SHA384`
- `TLS_AES_128_GCM_SHA256`
- `TLS_CHACHA20_POLY1305_SHA256`

**TLS 1.2 (acceptable):**
- `ECDHE-RSA-AES256-GCM-SHA384`
- `ECDHE-RSA-AES128-GCM-SHA256`
- `ECDHE-ECDSA-AES256-GCM-SHA384`
- `ECDHE-ECDSA-AES128-GCM-SHA256`
- `DHE-RSA-AES256-GCM-SHA384`

**Prohibited:**
- All RC4 cipher suites
- All DES/3DES cipher suites
- All NULL cipher suites
- All export-grade cipher suites
- ECDHE-RSA-AES*-SHA (SHA-1 based)

### 3.3 HSTS

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## 4. Data at Rest Encryption

### 4.1 Database Encryption

| Layer                    | Requirement                               | Implementation          |
| ------------------------ | ----------------------------------------- | ----------------------- |
| Storage/disk             | Transparent Data Encryption (TDE)         | Azure managed encryption |
| Column-level (sensitive) | AES-256-GCM                               | Application-level        |
| Backups                  | AES-256-GCM                               | Azure backup encryption  |

### 4.2 File Storage Encryption

- Files uploaded by users encrypted with AES-256-GCM
- Encryption keys stored separately from encrypted data
- Azure Blob Storage server-side encryption (SSE) enabled

### 4.3 Application Configuration

- Secrets (API keys, passwords) stored in Azure Key Vault
- Never stored in plaintext configuration files
- Environment variables for non-sensitive configuration
- Key Vault references for secrets in Azure App Configuration

---

## 5. Key Management

### 5.1 Key Hierarchy

```
Root CA / HSM
    └── Master Key (Azure Key Vault / HSM)
            ├── Data Encryption Keys (DEKs)
            ├── Key Encryption Keys (KEKs)
            ├── Signing Keys (JWT, etc.)
            └── API Keys
```

### 5.2 Key Management Requirements

| Requirement              | Standard                                        |
| ------------------------ | ----------------------------------------------- |
| Key generation           | Cryptographically secure RNG (CSPRNG)           |
| Key storage              | Azure Key Vault (HSM-backed for high-value keys)|
| Key length               | AES: 256-bit; RSA: ≥2048-bit; ECDSA: ≥256-bit  |
| Key rotation             | Annual (or upon compromise)                     |
| Key access               | Role-based, principle of least privilege        |
| Key backup               | Encrypted, stored in separate location          |
| Key destruction          | Cryptographic erasure when retired             |

### 5.3 Key Rotation Schedule

| Key Type               | Rotation Frequency    | Notes                           |
| ---------------------- | --------------------- | ------------------------------- |
| TLS/SSL certificates   | Annual (or 90 days)   | Depends on CA type              |
| JWT signing keys       | Quarterly             | Maintain key overlap period     |
| API keys               | Every 90 days         | Customer-facing keys            |
| Data encryption keys   | Annual                | Re-encrypt data after rotation  |
| Master keys            | Annual                | Via Azure Key Vault rotation    |

---

## 6. Cryptographic Algorithm Requirements

### 6.1 Approved Algorithms

#### Symmetric Encryption

| Algorithm    | Key Size   | Mode    | Use Case              |
| ------------ | ---------- | ------- | --------------------- |
| AES          | 256-bit    | GCM     | Data encryption ✅    |
| AES          | 256-bit    | CBC     | Legacy (avoid new use) ⚠️ |
| AES          | 128-bit    | GCM     | Acceptable ✅          |
| ChaCha20     | 256-bit    | Poly1305| Acceptable ✅          |

#### Asymmetric Encryption

| Algorithm    | Key Size   | Use Case              |
| ------------ | ---------- | --------------------- |
| RSA          | ≥ 2048-bit | TLS, signatures ✅    |
| RSA          | 4096-bit   | High-security ✅      |
| ECDSA        | P-256+     | TLS, signatures ✅    |
| ECDH         | P-256+     | Key exchange ✅       |
| Ed25519      | 256-bit    | Signatures ✅         |

#### Hash Functions

| Algorithm    | Output Size | Use Case                    |
| ------------ | ----------- | --------------------------- |
| SHA-256      | 256-bit     | Data integrity, signatures ✅ |
| SHA-384      | 384-bit     | Higher security ✅          |
| SHA-512      | 512-bit     | Highest security ✅         |
| SHA-3/256    | 256-bit     | Alternative ✅              |
| BLAKE2b      | Variable    | Performance ✅              |

#### Password Hashing (Special Category)

| Algorithm    | Configuration                          | Status      |
| ------------ | -------------------------------------- | ----------- |
| Argon2id     | m=64MB, t=3, p=4 (minimum)            | ✅ Preferred |
| bcrypt       | cost ≥ 12                              | ✅ Acceptable|
| scrypt       | N=16384, r=8, p=1 (minimum)           | ✅ Acceptable|
| PBKDF2-SHA256| 600,000+ iterations                    | ⚠️ Minimum  |

---

## 7. Prohibited Algorithms

The following algorithms are **prohibited** due to known vulnerabilities:

### Completely Prohibited

| Algorithm    | Reason                                      |
| ------------ | ------------------------------------------- |
| MD5          | Broken – collision attacks                  |
| SHA-1        | Broken – collision attacks                  |
| DES          | Key too short (56-bit)                      |
| 3DES (TDEA)  | Too slow, vulnerable (SWEET32)              |
| RC4          | Broken – multiple vulnerabilities           |
| RC2          | Weak, historical                            |
| IDEA         | Deprecated                                  |
| RSA < 1024   | Key too short                               |

### Prohibited for New Uses

| Algorithm    | Reason                                      |
| ------------ | ------------------------------------------- |
| RSA PKCS1 v1.5 | Padding oracle vulnerabilities – use OAEP |
| RSA < 2048   | Key too short for new deployments           |
| AES-ECB      | Deterministic – reveals patterns            |
| MD5/SHA1 in TLS | Weak HMAC                               |

---

## 8. Certificate Requirements

See [CERTIFICATE_MANAGEMENT.md](CERTIFICATE_MANAGEMENT.md) for full certificate lifecycle management.

### Summary

| Requirement              | Standard                                  |
| ------------------------ | ----------------------------------------- |
| Certificate Authority    | Trusted public CA or Azure managed        |
| Minimum key size         | RSA 2048-bit or ECDSA 256-bit             |
| Signature algorithm      | SHA-256 or stronger (no SHA-1)            |
| Maximum validity         | 398 days (CA/Browser Forum requirement)   |
| Subject Alternative Names | Required for all FQDNs                   |
| OCSP                     | Required                                  |

---

## 9. Implementation Guidelines

### Node.js Cryptography

```javascript
const crypto = require('crypto');

// ✅ AES-256-GCM encryption
function encrypt(plaintext, key) {
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

function decrypt(encryptedData, key) {
  const iv = Buffer.from(encryptedData.iv, 'base64');
  const authTag = Buffer.from(encryptedData.authTag, 'base64');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData.encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// ✅ Secure random token generation
function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

// ✅ SHA-256 hash (for non-password data)
function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// ❌ NEVER use these:
// crypto.createHash('md5')
// crypto.createHash('sha1')
// crypto.createCipher('des', ...)  // Deprecated, removed in Node.js 22
```

### Environment Variables for Secrets

```javascript
// ✅ Load secrets from environment variables
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');
if (!encryptionKey || encryptionKey.length !== 32) {
  throw new Error('Invalid ENCRYPTION_KEY: must be 32 bytes (256-bit)');
}

// Generate a key (run once, store securely):
// crypto.randomBytes(32).toString('base64')
```

---

## Version History

| Version | Date       | Changes                              |
| ------- | ---------- | ------------------------------------ |
| 1.0.0   | 2026-02-22 | Initial encryption policy created    |
