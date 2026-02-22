# Security Certificates and Standards

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Overview

This document provides an overview of security standards, certifications, and compliance frameworks relevant to the Phu-ai web application, along with our implementation status for each.

---

## SSL/TLS Certificates

### Azure App Service Certificates

| Certificate             | Domain                                   | Status      | Authority          |
| ----------------------- | ---------------------------------------- | ----------- | ------------------ |
| App Service Managed     | phuoptimizer81.azurewebsites.net         | ✅ Active    | Microsoft/DigiCert |
| Wildcard Azure Cert     | *.azurewebsites.net                      | ✅ Active    | Microsoft/DigiCert |

### Certificate Authorities

The following Certificate Authorities (CAs) are trusted for this application:

| CA                         | Type                   | Trust Level     |
| -------------------------- | ---------------------- | --------------- |
| DigiCert                   | Commercial CA          | High            |
| Let's Encrypt              | Free CA (ISRG)         | High            |
| Microsoft Azure CA         | Azure Managed          | High            |
| Sectigo (Comodo)           | Commercial CA          | High            |
| GlobalSign                 | Commercial CA          | High            |

---

## Security Standards Implementation

### Transport Layer Security (TLS)

| Standard        | Version    | Status        | Notes                                   |
| --------------- | ---------- | ------------- | --------------------------------------- |
| TLS             | 1.3        | ✅ Supported   | Preferred version                       |
| TLS             | 1.2        | ✅ Supported   | Minimum supported version               |
| TLS             | 1.1        | ❌ Disabled    | Deprecated, insecure                    |
| TLS             | 1.0        | ❌ Disabled    | Deprecated, insecure                    |
| SSL             | 3.0        | ❌ Disabled    | Deprecated, insecure (POODLE)           |
| SSL             | 2.0        | ❌ Disabled    | Deprecated, insecure                    |

### Cipher Suites

**Approved TLS 1.3 Cipher Suites:**
- `TLS_AES_256_GCM_SHA384` ✅
- `TLS_AES_128_GCM_SHA256` ✅
- `TLS_CHACHA20_POLY1305_SHA256` ✅

**Approved TLS 1.2 Cipher Suites:**
- `ECDHE-RSA-AES256-GCM-SHA384` ✅
- `ECDHE-RSA-AES128-GCM-SHA256` ✅
- `DHE-RSA-AES256-GCM-SHA384` ✅

**Deprecated/Disabled Cipher Suites:**
- RC4 ❌
- DES/3DES ❌
- NULL ciphers ❌
- Export ciphers ❌
- Anonymous ciphers ❌

---

## Compliance Framework Status

### OWASP Application Security

| Standard                          | Version   | Status         | Reference                                |
| --------------------------------- | --------- | -------------- | ---------------------------------------- |
| OWASP Top 10                      | 2021      | ✅ Addressed    | [COMPLIANCE.md](COMPLIANCE.md)           |
| OWASP ASVS (Application Security Verification Standard) | 4.0 | 🟡 Level 2 Target | https://owasp.org/ASVS |
| OWASP Testing Guide               | 4.2       | 🟡 Reference    | https://owasp.org/OTG                    |
| OWASP Secure Coding Practices     | 2.0       | ✅ Followed     | [CONTRIBUTING.md](CONTRIBUTING.md)       |

### Data Protection Standards

| Standard                          | Jurisdiction  | Status         | Reference                                      |
| --------------------------------- | ------------- | -------------- | ---------------------------------------------- |
| GDPR                              | EU/EEA        | ✅ Compliant    | [DATA_PROTECTION_POLICY.md](DATA_PROTECTION_POLICY.md) |
| CCPA/CPRA                         | California    | ✅ Compliant    | [PRIVACY_POLICY.md](PRIVACY_POLICY.md)         |
| VCDPA                             | Virginia      | ✅ Compliant    | [PRIVACY_POLICY.md](PRIVACY_POLICY.md)         |
| ISO/IEC 29100 (Privacy Framework) | International | 🟡 Aligned      | [PRIVACY_POLICY.md](PRIVACY_POLICY.md)         |

### Cryptography Standards

| Standard                          | Status         | Implementation                              |
| --------------------------------- | -------------- | ------------------------------------------- |
| NIST SP 800-57 (Key Management)   | ✅ Followed     | [ENCRYPTION_POLICY.md](ENCRYPTION_POLICY.md) |
| NIST SP 800-131A (Crypto Transition) | ✅ Compliant  | TLS 1.2+ only, SHA-2+                       |
| FIPS 140-2 (Crypto Modules)       | ⚠️ Not certified | Uses standard OS crypto libraries           |
| AES-256                           | ✅ Implemented  | Data at rest encryption                     |
| RSA-2048+                         | ✅ Implemented  | Certificate keys                            |
| ECDSA P-256+                      | ✅ Supported    | Modern certificate option                   |

---

## Security Certifications and Audits

### Third-Party Security Assessments

| Assessment Type            | Last Performed  | Next Scheduled  | Provider        |
| -------------------------- | --------------- | --------------- | --------------- |
| Vulnerability Assessment   | N/A             | Q2 2026         | TBD             |
| Penetration Testing        | N/A             | Q2 2026         | TBD             |
| Security Code Review       | N/A             | Ongoing (CI/CD) | Automated       |
| Dependency Audit           | Continuous      | Continuous      | Dependabot      |

### Automated Security Scanning

| Tool                       | Purpose                                   | Frequency     | Status        |
| -------------------------- | ----------------------------------------- | ------------- | ------------- |
| GitHub Dependabot          | Dependency vulnerability scanning         | Daily         | ✅ Active      |
| CodeQL                     | Static code analysis for security flaws   | On push/PR    | ✅ Active      |
| GitHub Secret Scanning     | Hardcoded secret detection                | On push       | ✅ Active      |
| npm audit                  | Node.js dependency audit                  | On build      | ✅ Active      |

---

## Certificate Transparency

Certificate Transparency (CT) is a public log of all issued SSL certificates, helping detect misissued certificates.

- All certificates issued by public CAs are logged to CT logs
- We monitor CT logs for unauthorized certificate issuance for our domains
- CT is enforced by Chrome requiring certificates to be CT-logged

**CT Log Monitors:**
- https://crt.sh/?q=phuoptimizer81.azurewebsites.net
- https://transparencyreport.google.com/

---

## HSTS Preloading

HTTP Strict Transport Security (HSTS) with preloading:

| Requirement                              | Status         | Notes                                   |
| ---------------------------------------- | -------------- | --------------------------------------- |
| HTTPS served on root domain              | ✅ Yes          | Azure HTTPS Only enabled                |
| HSTS header present                      | ✅ Yes          | See [SECURITY_HEADERS.md](SECURITY_HEADERS.md) |
| max-age >= 31536000                      | ✅ Yes          | 1 year minimum                          |
| includeSubDomains directive              | ✅ Yes          | All subdomains covered                  |
| preload directive                        | 🟡 Optional     | Can be added for maximum security       |
| Submitted to preload list                | 🟡 Optional     | https://hstspreload.org/                |

---

## Version History

| Version | Date       | Changes                                      |
| ------- | ---------- | -------------------------------------------- |
| 1.0.0   | 2026-02-22 | Initial security certificates document       |
