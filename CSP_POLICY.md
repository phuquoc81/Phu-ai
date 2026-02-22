# Content Security Policy (CSP) Guidelines

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Table of Contents

1. [Introduction to CSP](#introduction-to-csp)
2. [CSP Directives Reference](#csp-directives-reference)
3. [Recommended CSP for Phu-ai](#recommended-csp-for-phu-ai)
4. [CSP Implementation](#csp-implementation)
5. [CSP Testing and Reporting](#csp-testing-and-reporting)
6. [Common CSP Issues and Solutions](#common-csp-issues-and-solutions)
7. [CSP Migration Strategy](#csp-migration-strategy)

---

## 1. Introduction to CSP

Content Security Policy (CSP) is an HTTP security header that helps prevent Cross-Site Scripting (XSS), Clickjacking, and other code injection attacks by specifying which sources of content are trusted.

### How CSP Works

CSP works by:
1. The server sends the `Content-Security-Policy` header with every response
2. The browser enforces the policy for that page
3. Resources from disallowed sources are blocked
4. Violations can be reported to a designated endpoint

### Benefits of CSP

- Prevents XSS attacks by blocking inline scripts and untrusted sources
- Prevents data injection attacks
- Reduces the impact of vulnerabilities
- Provides visibility into content loading attempts via reporting

---

## 2. CSP Directives Reference

### Fetch Directives (Control Resource Loading)

| Directive           | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `default-src`       | Fallback for other fetch directives                  |
| `script-src`        | Controls JavaScript sources                          |
| `style-src`         | Controls CSS sources                                 |
| `img-src`           | Controls image sources                               |
| `font-src`          | Controls font sources                                |
| `connect-src`       | Controls network requests (fetch, XHR, WebSockets)   |
| `media-src`         | Controls audio/video sources                         |
| `object-src`        | Controls plugins (Flash, etc.)                       |
| `frame-src`         | Controls iframe sources                              |
| `worker-src`        | Controls Web Worker sources                          |
| `manifest-src`      | Controls web app manifest sources                    |

### Document Directives

| Directive           | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `base-uri`          | Restricts `<base>` tag URLs                          |
| `sandbox`           | Enables sandbox restrictions                         |
| `plugin-types`      | Controls allowed MIME types for plugins              |

### Navigation Directives

| Directive           | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `form-action`       | Restricts form submission URLs                       |
| `frame-ancestors`   | Controls which pages can embed this page in frames   |
| `navigate-to`       | Restricts navigation URLs                            |

### Reporting Directives

| Directive              | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `report-uri`           | URL to receive CSP violation reports (deprecated) |
| `report-to`            | Group for CSP violation reports (preferred)       |

### Special Source Values

| Value               | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `'none'`            | Block all sources                                              |
| `'self'`            | Allow same origin                                              |
| `'unsafe-inline'`   | Allow inline scripts/styles (avoid if possible)                |
| `'unsafe-eval'`     | Allow eval() and similar (avoid)                               |
| `'strict-dynamic'`  | Allow scripts loaded by trusted scripts                        |
| `'nonce-{value}'`   | Allow specific inline scripts with matching nonce              |
| `'sha256-{hash}'`   | Allow scripts/styles with specific hash                        |
| `https:`            | Allow any HTTPS source                                         |
| `data:`             | Allow data URIs (use carefully)                                |

---

## 3. Recommended CSP for Phu-ai

### Production CSP (Strict)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM_NONCE}';
  style-src 'self' 'nonce-{RANDOM_NONCE}';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.phu-ai.azure.com wss://api.phu-ai.azure.com;
  media-src 'none';
  object-src 'none';
  frame-src 'none';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
  report-to csp-endpoint;
```

### Development CSP (Less Strict)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' ws://localhost:* http://localhost:*;
  frame-ancestors 'none';
  base-uri 'self';
```

### CSP Report-Only (Testing)

Use `Content-Security-Policy-Report-Only` to test without enforcing:

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self';
  report-to csp-endpoint;
```

---

## 4. CSP Implementation

### Node.js / Express with helmet

```javascript
const helmet = require('helmet');
const crypto = require('crypto');

app.use((req, res, next) => {
  // Generate a unique nonce for each request
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      (req, res) => `'nonce-${res.locals.cspNonce}'`,
    ],
    styleSrc: [
      "'self'",
      (req, res) => `'nonce-${res.locals.cspNonce}'`,
    ],
    imgSrc: ["'self'", "data:", "https:"],
    fontSrc: ["'self'"],
    connectSrc: ["'self'"],
    mediaSrc: ["'none'"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    upgradeInsecureRequests: [],
    reportTo: "csp-endpoint",
  },
  reportOnly: process.env.NODE_ENV === 'development',
}));
```

### Using Nonces in Templates

In your HTML templates, use the nonce value:

```html
<!-- Script with nonce -->
<script nonce="<%= nonce %>">
  // Your inline script here
</script>

<!-- Style with nonce -->
<style nonce="<%= nonce %>">
  /* Your inline style here */
</style>
```

### Setting Up Reporting

Configure CSP violation reporting:

```javascript
// Set up the Reporting-Endpoints header
app.use((req, res, next) => {
  res.setHeader(
    'Reporting-Endpoints',
    'csp-endpoint="https://your-domain.com/api/csp-report"'
  );
  next();
});

// Endpoint to receive CSP violation reports
app.post('/api/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  console.log('CSP Violation:', req.body);
  // Log and monitor violations
  res.status(204).end();
});
```

---

## 5. CSP Testing and Reporting

### Testing Your CSP

1. **Browser Developer Tools**: Check the Console for CSP violation errors
2. **CSP Evaluator**: https://csp-evaluator.withgoogle.com/
3. **Report URI**: https://report-uri.com/ (CSP violation monitoring)
4. **Mozilla Observatory**: https://observatory.mozilla.org/
5. **SecurityHeaders.com**: https://securityheaders.com/

### Reading Violation Reports

CSP violation reports are JSON objects like:
```json
{
  "csp-report": {
    "document-uri": "https://example.com/page",
    "violated-directive": "script-src",
    "effective-directive": "script-src",
    "original-policy": "default-src 'self'; script-src 'self'",
    "blocked-uri": "https://external.example.com/malicious.js",
    "status-code": 200
  }
}
```

---

## 6. Common CSP Issues and Solutions

### Issue: Inline Scripts Blocked

**Problem:** `script-src` CSP blocks inline `<script>` tags.

**Solutions:**
1. Move inline scripts to external files ✅ (recommended)
2. Use nonces: `'nonce-{random}'` ✅
3. Use hashes: `'sha256-{hash}'` ✅
4. **Avoid:** `'unsafe-inline'` ❌ (negates XSS protection)

### Issue: eval() Blocked

**Problem:** JavaScript's `eval()`, `Function()`, `setTimeout(string)` are blocked.

**Solutions:**
1. Refactor code to avoid eval ✅ (recommended)
2. Use `'unsafe-eval'` only if absolutely necessary ⚠️

### Issue: Third-Party Scripts

**Problem:** Third-party script domains need to be in `script-src`.

**Solution:** Add specific trusted domains:
```
script-src 'self' https://trusted-cdn.example.com;
```

### Issue: Inline Styles Blocked

**Problem:** Inline `style="..."` attributes blocked.

**Solutions:**
1. Move styles to CSS classes ✅ (recommended)
2. Use nonces on `<style>` tags ✅
3. **Avoid:** `'unsafe-inline'` in `style-src` ❌

---

## 7. CSP Migration Strategy

### Phase 1: Audit and Report-Only
1. Deploy `Content-Security-Policy-Report-Only` header
2. Collect violation reports for 2+ weeks
3. Identify all legitimate resource sources

### Phase 2: Refactor
1. Move inline scripts to external files
2. Add nonces to remaining inline scripts
3. Remove eval() usage

### Phase 3: Enforce
1. Switch from `Report-Only` to `Content-Security-Policy`
2. Start with a permissive policy
3. Monitor violations and tighten gradually

### Phase 4: Harden
1. Remove `'unsafe-inline'` if present
2. Remove `'unsafe-eval'` if present
3. Use `'strict-dynamic'` where appropriate
4. Enable `upgrade-insecure-requests`

---

## Version History

| Version | Date       | Changes                          |
| ------- | ---------- | -------------------------------- |
| 1.0.0   | 2026-02-22 | Initial CSP policy guide created |
