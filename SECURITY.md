# Security Policy – Shop Anglo

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Shop Anglo, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Send a detailed report to: **security@shop-anglo.com**

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Any suggested fixes (optional)

We will acknowledge your report within **48 hours** and aim to release a fix within **14 days** for critical issues.

## Security Measures

Shop Anglo implements the following security controls:

- **HTTPS / TLS** – All traffic is encrypted via TLS 1.2+. HTTP requests are automatically upgraded.
- **HTTP Security Headers** – Helmet.js enforces CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and more.
- **Content Security Policy (CSP)** – Restricts resource loading to trusted origins only.
- **HSTS (HTTP Strict Transport Security)** – Enforced for 1 year including subdomains; eligible for browser preload lists.
- **Clickjacking Protection** – `X-Frame-Options: DENY` and `frame-ancestors 'none'` prevent embedding in frames.
- **Input Sanitisation** – All user-supplied data is validated and sanitised server-side.
- **Dependency Auditing** – `npm audit` is run as part of every CI build to catch known CVEs.

## Compliance

Shop Anglo complies with:
- **GDPR** (General Data Protection Regulation)
- **PCI-DSS** guidelines for payment card data security
- **ISO 27001** information security management principles
- Local jewellery trade licensing regulations

## Jewellery Certification Policy

Every item sold through Shop Anglo is:
1. Accompanied by an official hallmark certificate
2. Certified by an independent gemological laboratory (e.g. GIA, AGS)
3. Traceable via a unique item serial number
4. Covered under our authenticity guarantee

See [public/certificates.html](public/certificates.html) for detailed certification records.
