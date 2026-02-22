# Security Policy

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Project:** Phu-ai Web Application  

---

## Table of Contents

1. [Supported Versions](#supported-versions)
2. [Reporting a Vulnerability](#reporting-a-vulnerability)
3. [Disclosure Policy](#disclosure-policy)
4. [Security Response Process](#security-response-process)
5. [Security Measures](#security-measures)
6. [Out of Scope](#out-of-scope)
7. [Safe Harbor](#safe-harbor)
8. [Contact Information](#contact-information)

---

## Supported Versions

The following versions of Phu-ai currently receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0   | :x:                |

We encourage all users to run the latest version of the application to benefit from the most recent security patches.

---

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue in the Phu-ai project, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, report security vulnerabilities using one of the following methods:

1. **GitHub Private Security Advisory** (preferred):  
   Navigate to [Security Advisories](https://github.com/phuquoc81/Phu-ai/security/advisories/new) and submit a private advisory.

2. **Email**:  
   Send your report to the security team. Include as much detail as possible.

3. **Encrypted Communication**:  
   For highly sensitive issues, use encrypted communication channels.

### What to Include in Your Report

Please provide the following information:

- **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass, etc.)
- **Affected component(s)** and version(s)
- **Step-by-step instructions** to reproduce the issue
- **Proof of concept** or exploit code (if applicable)
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)
- **Your contact information** for follow-up questions

---

## Disclosure Policy

We follow a **coordinated vulnerability disclosure** policy:

1. Reporter submits vulnerability details privately.
2. Security team acknowledges receipt within **48 hours**.
3. Security team validates and investigates the report within **7 business days**.
4. Security team develops and tests a fix.
5. Fix is deployed to production.
6. Public disclosure occurs **90 days** after the initial report (or sooner if agreed upon with the reporter).
7. Reporter is credited in the security advisory (with their consent).

---

## Security Response Process

### Response Timeline

| Stage                    | Target Time         |
| ------------------------ | ------------------- |
| Initial acknowledgment   | Within 48 hours     |
| Vulnerability validation | Within 7 days       |
| Severity assessment      | Within 7 days       |
| Fix development          | Based on severity   |
| Critical fixes           | Within 7 days       |
| High severity fixes      | Within 30 days      |
| Medium severity fixes    | Within 60 days      |
| Low severity fixes       | Within 90 days      |
| Public disclosure        | Within 90 days      |

### Severity Classification

We use the **CVSS (Common Vulnerability Scoring System)** to classify vulnerabilities:

| Severity | CVSS Score | Response Priority |
| -------- | ---------- | ----------------- |
| Critical | 9.0 – 10.0 | Immediate         |
| High     | 7.0 – 8.9  | High Priority     |
| Medium   | 4.0 – 6.9  | Normal Priority   |
| Low      | 0.1 – 3.9  | Low Priority      |

---

## Security Measures

The Phu-ai project implements the following security measures:

### Application Security
- Input validation and sanitization on all user inputs
- Output encoding to prevent Cross-Site Scripting (XSS)
- Parameterized queries to prevent SQL injection
- HTTPS/TLS encryption for all communications
- Secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
- Regular dependency updates and vulnerability scanning

### Authentication & Authorization
- Secure session management
- Multi-factor authentication support
- Role-based access control (RBAC)
- Password hashing using modern algorithms (bcrypt/Argon2)

### Infrastructure Security
- Regular security audits and penetration testing
- Automated dependency vulnerability scanning via Dependabot
- GitHub Actions security workflows
- Azure Web App security configurations

### Data Protection
- Encryption of sensitive data at rest and in transit
- Minimal data collection principle
- Regular data backups with encryption
- Data retention policies in compliance with GDPR

---

## Out of Scope

The following are **not** considered security vulnerabilities for this project:

- Vulnerabilities in third-party services or applications not under our control
- Issues requiring physical access to a user's device
- Social engineering attacks targeting project maintainers
- Denial of Service (DoS) attacks
- Issues already known and documented
- Vulnerabilities in outdated, unsupported browser versions
- Missing security headers on non-sensitive pages with low risk
- Theoretical vulnerabilities without practical exploitation paths
- Rate limiting issues on public, non-sensitive endpoints

---

## Safe Harbor

We consider security research conducted in good faith to be authorized. We will not take legal action against researchers who:

- Report vulnerabilities responsibly following this policy
- Do not access, modify, or delete user data
- Do not disrupt services or degrade user experience
- Do not engage in social engineering of project team members
- Act in good faith and in accordance with this policy

We appreciate and recognize the security research community's contributions to keeping our users safe.

---

## Security Updates and Advisories

Security advisories and updates will be published at:
- [GitHub Security Advisories](https://github.com/phuquoc81/Phu-ai/security/advisories)
- Repository releases and changelog

---

## Contact Information

**Security Contact:** phuquoc81 portfolio security team  
**GitHub:** [@phuquoc81](https://github.com/phuquoc81)  
**Security Advisories:** https://github.com/phuquoc81/Phu-ai/security/advisories  

---

## Version History

| Version | Date       | Changes                         |
| ------- | ---------- | ------------------------------- |
| 1.0.0   | 2026-02-22 | Initial security policy created |
