# Security Policy

## Supported Versions

The following versions of Phu AI are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Phu AI seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an e-mail to the repository owner via the contact information on the GitHub profile. Include as much of the information listed below as you can to help us better understand and resolve the issue:

- Type of issue (e.g. SQL injection, cross-site scripting, broken authentication, etc.)
- Full paths of source files related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Response Timeline

- **Acknowledgement**: Within 48 hours of receiving your report we will acknowledge receipt.
- **Assessment**: Within 7 days we will provide an initial assessment of the vulnerability and an expected resolution timeline.
- **Resolution**: Critical vulnerabilities will be patched within 14 days. High and medium severity issues within 30 days.

## Security Hardening

Phu AI applies the following security controls:

### Transport Security
- All traffic is served exclusively over **HTTPS/TLS 1.2+**.
- HTTP Strict Transport Security (HSTS) is enforced with a minimum `max-age` of one year.
- Certificates are managed via Azure App Service Managed Certificates (auto-renewed) or a CA-signed certificate uploaded through the Azure Portal.

### Content Security Policy (CSP)
The application sets the following HTTP security headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Dependency Management
- Dependencies are kept up to date automatically via **Dependabot**.
- All pull requests are scanned by **GitHub CodeQL** before merge.

### Secret Management
- Secrets (e.g., `AZURE_WEBAPP_PUBLISH_PROFILE`) are stored exclusively in **GitHub Encrypted Secrets** and are never hard-coded in source files.

### Branch Protection
The `main` branch is protected with the following rules:
- Require pull request reviews before merging (at least 1 approval).
- Require status checks to pass before merging (CodeQL, build).
- Restrict who can push directly to `main`.

## Responsible Disclosure

We ask that you give us reasonable time to address the issue before any public disclosure. We will credit security researchers who responsibly disclose valid vulnerabilities in the release notes for the fix.
