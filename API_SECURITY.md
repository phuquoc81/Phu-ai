# API Security Guidelines

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication and Authorization](#authentication-and-authorization)
3. [Input Validation and Sanitization](#input-validation-and-sanitization)
4. [Rate Limiting and Throttling](#rate-limiting-and-throttling)
5. [Security Headers for APIs](#security-headers-for-apis)
6. [HTTPS and Transport Security](#https-and-transport-security)
7. [Error Handling](#error-handling)
8. [API Versioning](#api-versioning)
9. [Logging and Monitoring](#logging-and-monitoring)
10. [Third-Party API Security](#third-party-api-security)
11. [Implementation Examples](#implementation-examples)

---

## 1. Overview

This document defines security guidelines for APIs in the Phu-ai web application. APIs present significant security risks if not properly secured. These guidelines address the [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) risks.

### OWASP API Security Top 10 Coverage

| Risk                                         | Mitigation                                       |
| -------------------------------------------- | ------------------------------------------------ |
| API1: Broken Object Level Authorization      | Resource-level auth checks on every endpoint     |
| API2: Broken User Authentication             | Strong auth, token management                    |
| API3: Broken Object Property Level Auth      | Response filtering, schema validation            |
| API4: Unrestricted Resource Consumption      | Rate limiting, request size limits               |
| API5: Broken Function Level Authorization   | Role-based endpoint access control              |
| API6: Unrestricted Access to Sensitive Data  | Data minimization, field-level access control   |
| API7: Server Side Request Forgery            | URL validation, allowlisting                     |
| API8: Security Misconfiguration              | Security headers, secure defaults                |
| API9: Improper Inventory Management          | API versioning, deprecation policy               |
| API10: Unsafe Consumption of APIs            | Third-party API validation, sandboxing           |

---

## 2. Authentication and Authorization

### 2.1 API Authentication Methods

| Method                    | Use Case                              | Security Level  |
| ------------------------- | ------------------------------------- | --------------- |
| JWT Bearer Token          | User API calls                        | High            |
| API Key (hashed)          | Service-to-service, third-party       | High            |
| OAuth 2.0 + PKCE          | User delegation                       | High            |
| Session Cookie            | Browser-based API calls               | High (with CSRF)|
| Basic Auth                | Never use in production               | ❌ Prohibited   |

### 2.2 Authentication Requirements

```http
# Required for all authenticated endpoints
Authorization: Bearer <jwt_token>
```

- Every endpoint must explicitly declare its authentication requirements
- No authentication bypasses or backdoors
- Authentication checked before any business logic executes
- Token expiry enforced (see [AUTHENTICATION_POLICY.md](AUTHENTICATION_POLICY.md))

### 2.3 Object-Level Authorization

**Always verify the authenticated user owns or has permission for the specific resource:**

```javascript
// ❌ BAD: No resource ownership check
app.get('/api/documents/:id', auth, async (req, res) => {
  const doc = await Document.findById(req.params.id);
  res.json(doc); // Any user can access any document!
});

// ✅ GOOD: Verify ownership
app.get('/api/documents/:id', auth, async (req, res) => {
  const doc = await Document.findOne({
    _id: req.params.id,
    userId: req.user.id // Always filter by authenticated user
  });
  
  if (!doc) {
    return res.status(404).json({ error: 'Not found' }); // 404, not 403
  }
  
  res.json(doc);
});
```

---

## 3. Input Validation and Sanitization

### 3.1 Validation Requirements

All API inputs must be validated:

| Input Type       | Validation Required                               |
| ---------------- | ------------------------------------------------- |
| Path parameters  | Type, format, range                               |
| Query parameters | Type, format, allowed values                      |
| Request body     | Schema validation (JSON Schema or similar)        |
| File uploads     | Type, size, content                               |
| Headers          | Expected headers present and valid                |

### 3.2 Request Size Limits

```javascript
// Limit request body size
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// File upload limits
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum
    files: 5,                    // Maximum 5 files per request
  }
});
```

### 3.3 Schema Validation Example

```javascript
const { body, param, validationResult } = require('express-validator');

const validateCreateQuery = [
  body('prompt')
    .isString()
    .isLength({ min: 1, max: 4000 })
    .escape()
    .withMessage('Prompt must be 1-4000 characters'),
  body('model')
    .optional()
    .isIn(['standard', 'advanced'])
    .withMessage('Invalid model type'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

---

## 4. Rate Limiting and Throttling

### 4.1 Rate Limit Configuration

| Endpoint Type              | Rate Limit           | Window    |
| -------------------------- | -------------------- | --------- |
| Authentication endpoints   | 10 requests          | 15 min    |
| API queries                | 60 requests          | 1 min     |
| Bulk operations            | 10 requests          | 1 min     |
| File uploads               | 5 requests           | 1 min     |
| Password reset             | 3 requests           | 1 hour    |

### 4.2 Rate Limit Response

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 60
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1740252000

{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again in 60 seconds.",
  "retry_after": 60
}
```

### 4.3 Implementation

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  keyGenerator: (req) => {
    // Use user ID if authenticated, IP otherwise
    return req.user ? req.user.id : req.ip;
  },
});

app.use('/api/', apiLimiter);
```

---

## 5. Security Headers for APIs

APIs should return appropriate security headers:

```http
Content-Type: application/json; charset=utf-8
X-Content-Type-Options: nosniff
Cache-Control: no-store, no-cache
Pragma: no-cache
X-Request-ID: <unique-request-id>
```

### CORS Configuration

```javascript
const cors = require('cors');

const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://phuoptimizer81.azurewebsites.net',
      // Add other allowed origins
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
```

---

## 6. HTTPS and Transport Security

- All API endpoints accessible via HTTPS only
- HTTP requests redirected to HTTPS (301)
- TLS 1.2 minimum (TLS 1.3 preferred)
- HSTS header on API responses
- Certificate validation enforced on outgoing connections

---

## 7. Error Handling

### 7.1 Error Response Format

```json
{
  "error": "validation_error",
  "message": "The request contains invalid data",
  "request_id": "req-abc123",
  "timestamp": "2026-02-22T15:00:00Z"
}
```

### 7.2 Error Handling Rules

```javascript
// ❌ BAD: Exposes sensitive information
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,           // Never expose stack traces
    dbQuery: err.query,         // Never expose DB queries
    internalCode: err.code,     // Never expose internal codes
  });
});

// ✅ GOOD: Safe error handling
app.use((err, req, res, next) => {
  const requestId = req.headers['x-request-id'] || generateId();
  
  // Log full error internally
  logger.error({ err, requestId, url: req.url });
  
  // Return safe error to client
  const statusCode = err.status || 500;
  const isUserError = statusCode >= 400 && statusCode < 500;
  
  res.status(statusCode).json({
    error: isUserError ? err.type : 'internal_server_error',
    message: isUserError ? err.message : 'An unexpected error occurred',
    request_id: requestId,
  });
});
```

### 7.3 HTTP Status Codes

| Code | Usage                                                    |
| ---- | -------------------------------------------------------- |
| 200  | Success                                                  |
| 201  | Resource created                                         |
| 204  | Success, no content                                      |
| 400  | Bad request (validation error, malformed JSON)           |
| 401  | Authentication required or failed                        |
| 403  | Authenticated but not authorized                         |
| 404  | Resource not found (use instead of 403 to prevent enumeration) |
| 409  | Conflict (e.g., duplicate resource)                      |
| 422  | Unprocessable entity                                     |
| 429  | Rate limit exceeded                                      |
| 500  | Internal server error                                    |

---

## 8. API Versioning

### 8.1 Versioning Strategy

- APIs are versioned using URL path versioning: `/api/v1/endpoint`
- Semantic versioning: major version in URL
- Minimum 6 months deprecation notice before removing versions
- Deprecated versions return `Deprecation` and `Sunset` headers

```http
GET /api/v1/query HTTP/1.1
Deprecation: true
Sunset: Mon, 22 Feb 2027 00:00:00 GMT
Link: </api/v2/query>; rel="successor-version"
```

---

## 9. Logging and Monitoring

### 9.1 API Request Logging

Log the following for each request:
- Timestamp
- Request ID
- HTTP method and path
- Query parameters (sanitized)
- Response status code
- Response time
- User ID (if authenticated)
- IP address

**Never log:**
- Authorization tokens or API keys
- Request body contents with sensitive data
- Password fields

---

## 10. Third-Party API Security

When consuming external APIs:

- Validate all responses (don't trust external data)
- Use allowlisting for external URLs (prevent SSRF)
- Implement request timeouts (prevent hanging)
- Cache responses where appropriate
- Never pass user-supplied data directly to external APIs
- Store API keys in environment variables, never in code

---

## Version History

| Version | Date       | Changes                            |
| ------- | ---------- | ---------------------------------- |
| 1.0.0   | 2026-02-22 | Initial API security guide created |
