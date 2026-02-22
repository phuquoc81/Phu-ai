# Security Headers Guide

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Overview

This document describes the recommended security HTTP headers for the Phu-ai web application. Proper security headers protect users from common web attacks such as Cross-Site Scripting (XSS), Clickjacking, MIME type sniffing, and more.

---

## Recommended Security Headers

### 1. Content-Security-Policy (CSP)

Controls which resources the browser is allowed to load.

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{RANDOM}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.phu-ai.azure.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
```

See [CSP_POLICY.md](CSP_POLICY.md) for detailed CSP configuration.

### 2. HTTP Strict Transport Security (HSTS)

Forces browsers to use HTTPS.

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Parameters:**
- `max-age=31536000`: Cache for 1 year (recommended minimum)
- `includeSubDomains`: Apply to all subdomains
- `preload`: Submit to browser preload lists (optional but recommended)

**⚠️ Note:** Only add the `preload` directive after verifying all subdomains support HTTPS.

### 3. X-Content-Type-Options

Prevents MIME type sniffing.

```
X-Content-Type-Options: nosniff
```

### 4. X-Frame-Options

Prevents Clickjacking by controlling if the page can be embedded in iframes.

```
X-Frame-Options: DENY
```

**Alternatives:**
- `DENY`: Never allow framing (most secure)
- `SAMEORIGIN`: Only allow framing from same origin
- `ALLOW-FROM uri`: Allow specific origins (deprecated, use CSP `frame-ancestors` instead)

### 5. Referrer-Policy

Controls how much referrer information is included with requests.

```
Referrer-Policy: strict-origin-when-cross-origin
```

**Options (most to least restrictive):**
- `no-referrer`: Never send referrer
- `no-referrer-when-downgrade`: Don't send for HTTPS→HTTP
- `strict-origin-when-cross-origin`: Send origin only for cross-origin (recommended)
- `same-origin`: Only send for same-origin requests

### 6. Permissions-Policy (Feature-Policy)

Controls which browser features and APIs the page can use.

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()
```

Disable all features not needed by the application.

### 7. X-XSS-Protection

Legacy XSS protection for older browsers (CSP is preferred for modern browsers).

```
X-XSS-Protection: 1; mode=block
```

### 8. Cache-Control

Prevents sensitive information from being cached.

```
Cache-Control: no-store, no-cache, must-revalidate, private
```

For public, static assets:
```
Cache-Control: public, max-age=31536000, immutable
```

### 9. Cross-Origin Embedder Policy (COEP)

Prevents loading resources from other origins unless explicitly allowed.

```
Cross-Origin-Embedder-Policy: require-corp
```

### 10. Cross-Origin Opener Policy (COOP)

Isolates the browsing context.

```
Cross-Origin-Opener-Policy: same-origin
```

### 11. Cross-Origin Resource Policy (CORP)

Prevents other websites from loading your resources.

```
Cross-Origin-Resource-Policy: same-origin
```

---

## Header Configuration Examples

### Node.js / Express

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

### Azure Web App (web.config)

```xml
<configuration>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-Frame-Options" value="DENY" />
        <add name="X-XSS-Protection" value="1; mode=block" />
        <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
        <add name="Permissions-Policy" value="camera=(), microphone=(), geolocation=()" />
        <add name="Content-Security-Policy" value="default-src 'self'; frame-ancestors 'none'" />
        <remove name="X-Powered-By" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

---

## Security Header Testing

Use the following tools to test your security headers:

| Tool                    | URL                                          |
| ----------------------- | -------------------------------------------- |
| SecurityHeaders.com     | https://securityheaders.com/                 |
| Mozilla Observatory     | https://observatory.mozilla.org/             |
| OWASP ZAP               | https://www.zaproxy.org/                     |
| SSL Labs                | https://www.ssllabs.com/ssltest/             |

### Target Scores

| Tool                    | Target Score |
| ----------------------- | ------------ |
| SecurityHeaders.com     | A+           |
| Mozilla Observatory     | A+           |
| SSL Labs (SSL/TLS)      | A+           |

---

## Additional Security Measures

### Remove Information-Leaking Headers

Remove or obscure headers that reveal technology information:

```
# Remove these headers:
X-Powered-By: Express
Server: Apache/2.4.1
X-AspNet-Version: 4.0.30319
```

### Secure Cookies

Set the following cookie attributes:

```
Set-Cookie: session=value; Secure; HttpOnly; SameSite=Strict; Path=/
```

- `Secure`: Only sent over HTTPS
- `HttpOnly`: Not accessible via JavaScript
- `SameSite=Strict`: Not sent on cross-site requests

---

## Version History

| Version | Date       | Changes                                |
| ------- | ---------- | -------------------------------------- |
| 1.0.0   | 2026-02-22 | Initial security headers guide created |
