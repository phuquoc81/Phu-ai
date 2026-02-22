# Audit Log Policy

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Table of Contents

1. [Purpose and Scope](#purpose-and-scope)
2. [What We Log](#what-we-log)
3. [Log Format and Structure](#log-format-and-structure)
4. [Log Storage and Retention](#log-storage-and-retention)
5. [Log Security](#log-security)
6. [Log Monitoring and Alerting](#log-monitoring-and-alerting)
7. [Log Review Procedures](#log-review-procedures)
8. [Incident Investigation](#incident-investigation)
9. [Compliance Requirements](#compliance-requirements)
10. [Implementation Guidelines](#implementation-guidelines)

---

## 1. Purpose and Scope

### Purpose
This policy defines the requirements for audit logging in the Phu-ai web application. Audit logs are critical for:
- Detecting and investigating security incidents
- Compliance with regulatory requirements (GDPR, CCPA, etc.)
- Troubleshooting operational issues
- Providing an audit trail for accountability

### Scope
This policy applies to:
- All Phu-ai web application components
- Authentication and authorization events
- Data access and modification events
- Administrative actions
- Security-related events

---

## 2. What We Log

### 2.1 Authentication Events

| Event                          | Log Level  | Data Captured                                    |
| ------------------------------ | ---------- | ------------------------------------------------ |
| Successful login               | INFO       | Timestamp, user ID, IP, user agent, method        |
| Failed login attempt           | WARN       | Timestamp, username, IP, user agent, reason       |
| Account lockout                | WARN       | Timestamp, user ID, IP, lockout reason            |
| Password change                | INFO       | Timestamp, user ID, IP (not the password itself)  |
| MFA challenge                  | INFO       | Timestamp, user ID, IP, success/failure           |
| Token issuance                 | INFO       | Timestamp, user ID, token type, expiry            |
| Logout                         | INFO       | Timestamp, user ID, session duration              |
| OAuth authorization            | INFO       | Timestamp, user ID, provider, scopes              |

### 2.2 Authorization Events

| Event                          | Log Level  | Data Captured                                    |
| ------------------------------ | ---------- | ------------------------------------------------ |
| Access granted                 | DEBUG      | Timestamp, user ID, resource, action              |
| Access denied                  | WARN       | Timestamp, user ID, resource, action, reason      |
| Permission escalation attempt  | ERROR      | Timestamp, user ID, attempted resource/action     |
| Role assignment                | INFO       | Timestamp, admin user, target user, role          |
| Role removal                   | INFO       | Timestamp, admin user, target user, role          |

### 2.3 Data Events

| Event                          | Log Level  | Data Captured                                    |
| ------------------------------ | ---------- | ------------------------------------------------ |
| Data read (sensitive)          | INFO       | Timestamp, user ID, data type, record ID          |
| Data creation                  | INFO       | Timestamp, user ID, data type, record ID          |
| Data modification              | INFO       | Timestamp, user ID, data type, record ID, fields changed |
| Data deletion                  | WARN       | Timestamp, user ID, data type, record ID          |
| Data export                    | WARN       | Timestamp, user ID, export type, record count     |
| Bulk operations                | WARN       | Timestamp, user ID, operation type, record count  |

### 2.4 Security Events

| Event                          | Log Level  | Data Captured                                    |
| ------------------------------ | ---------- | ------------------------------------------------ |
| Security header violations     | WARN       | Timestamp, IP, violation type, URL               |
| CSRF token failure             | WARN       | Timestamp, user ID, IP, URL                      |
| Input validation failure       | WARN       | Timestamp, IP, field, validation rule violated    |
| Rate limit exceeded            | WARN       | Timestamp, IP, endpoint, limit type              |
| Suspicious activity detected   | ERROR      | Timestamp, IP, user ID, activity description     |
| Security scan/probing detected | ERROR      | Timestamp, IP, scan type, target                 |

### 2.5 System Events

| Event                          | Log Level  | Data Captured                                    |
| ------------------------------ | ---------- | ------------------------------------------------ |
| Application startup            | INFO       | Timestamp, version, environment, configuration   |
| Application shutdown           | INFO       | Timestamp, reason, uptime                        |
| Configuration changes          | INFO       | Timestamp, admin, config key, old value, new value |
| Health check                   | DEBUG      | Timestamp, status, metrics                       |
| Errors and exceptions          | ERROR      | Timestamp, error type, message, stack trace      |
| External API calls             | INFO       | Timestamp, service, endpoint, status code        |

---

## 3. Log Format and Structure

### Standard Log Entry Format (JSON)

```json
{
  "timestamp": "2026-02-22T15:30:00.000Z",
  "level": "INFO",
  "event_type": "auth.login.success",
  "correlation_id": "req-abc123",
  "user": {
    "id": "user-456",
    "ip": "192.168.1.1",
    "user_agent": "Mozilla/5.0 ..."
  },
  "action": {
    "resource": "/api/session",
    "method": "POST",
    "result": "success"
  },
  "metadata": {
    "auth_method": "password",
    "session_id": "sess-789",
    "geo": "US"
  }
}
```

### Log Levels

| Level   | Numeric Value | Usage                                              |
| ------- | ------------- | -------------------------------------------------- |
| DEBUG   | 10            | Detailed debugging information                     |
| INFO    | 20            | General informational messages                     |
| WARN    | 30            | Potentially harmful situations requiring attention  |
| ERROR   | 40            | Error events that may still allow application to run |
| FATAL   | 50            | Very severe errors causing application to abort    |

### Privacy Requirements for Logs

**NEVER log:**
- Passwords or password hashes
- Full credit card numbers (only last 4 digits)
- Social Security Numbers or national IDs
- Authentication tokens or session tokens (only token hashes)
- API keys or secrets
- Full payment information

**Pseudonymize or hash:**
- Email addresses in high-volume logs
- Personal identifiers where full value is not needed

---

## 4. Log Storage and Retention

### Storage Locations

| Log Type              | Storage System             | Environment     |
| --------------------- | -------------------------- | --------------- |
| Application logs      | Azure Monitor / App Insights | All             |
| Security event logs   | Azure Monitor / Sentinel   | All             |
| Access logs           | Azure Storage Account      | All             |
| Audit logs            | Azure Log Analytics        | All             |
| Backup logs           | Azure Storage (immutable)  | All             |

### Retention Schedule

| Log Category          | Retention Period   | Legal Hold    |
| --------------------- | ------------------ | ------------- |
| Application logs      | 30 days            | 1 year        |
| Authentication logs   | 90 days            | 2 years       |
| Security event logs   | 1 year             | 5 years       |
| Audit/compliance logs | 2 years            | 7 years       |
| Incident-related logs | 2 years            | 7 years       |
| Financial audit logs  | 7 years            | 10 years      |

---

## 5. Log Security

### Integrity

- Logs must be tamper-proof and tamper-evident
- Write-once storage where possible
- Cryptographic signing of log entries for critical audit logs
- Regular integrity checks

### Access Control

- Log access restricted to authorized security and operations personnel
- Separation of duties: developers cannot delete security logs
- All log access is itself logged (meta-logging)
- Privileged access requires multi-factor authentication

### Transmission

- Logs transmitted only over encrypted channels
- No sensitive log data sent over unencrypted connections

---

## 6. Log Monitoring and Alerting

### Automated Alerts

| Alert Condition                              | Severity   | Response Time  |
| -------------------------------------------- | ---------- | -------------- |
| 10+ failed logins from same IP in 5 minutes  | HIGH       | 15 minutes     |
| Privilege escalation attempt detected        | CRITICAL   | Immediate      |
| Admin actions outside business hours         | MEDIUM     | 4 hours        |
| Bulk data export > 1000 records              | HIGH       | 30 minutes     |
| Application error rate > 5% in 5 minutes    | MEDIUM     | 30 minutes     |
| Log pipeline failure                         | HIGH       | 15 minutes     |
| Security header violation spike              | MEDIUM     | 1 hour         |

### Monitoring Tools

- Azure Monitor and Application Insights
- Azure Sentinel (SIEM)
- Custom alerting via Azure Logic Apps or Functions

---

## 7. Log Review Procedures

### Regular Reviews

| Review Type           | Frequency  | Reviewer                      |
| --------------------- | ---------- | ----------------------------- |
| Security event review | Daily      | Security team                 |
| Access log review     | Weekly     | Operations team               |
| Failed auth review    | Daily      | Security team                 |
| Admin action review   | Weekly     | Security team                 |
| Compliance audit log  | Monthly    | Compliance officer            |
| Full audit review     | Quarterly  | Management and security team  |

---

## 8. Incident Investigation

When a security incident is suspected:

1. **Preserve logs**: Immediately preserve and protect relevant logs
2. **Export logs**: Export logs to secure, isolated storage for investigation
3. **Timeline reconstruction**: Build a timeline from log entries
4. **Chain of custody**: Document log evidence handling
5. **Analysis**: Analyze logs using SIEM tools

See [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md) for full incident response procedures.

---

## 9. Compliance Requirements

| Regulation    | Log Requirement                                              | Our Implementation      |
| ------------- | ------------------------------------------------------------ | ----------------------- |
| GDPR          | Log data access to personal data; support subject access requests | ✅ Implemented          |
| PCI DSS       | Track and monitor all access to network resources and cardholder data | ✅ Implemented          |
| SOX           | Maintain audit trails for financial operations              | ✅ N/A (no financial ops)|
| HIPAA         | Log all access to protected health information              | ✅ N/A (no PHI)          |
| ISO 27001     | Log management, monitoring, and review                      | ✅ Implemented           |

---

## 10. Implementation Guidelines

### Node.js Logging Setup

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'phu-ai' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
  ],
});

// Security audit logger
const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/audit.log',
      maxsize: 10485760, // 10MB
      maxFiles: 30,
    }),
  ],
});

// Example audit log usage
function logAuthEvent(eventType, userId, ip, userAgent, result) {
  auditLogger.info({
    event_type: eventType,
    user: { id: userId, ip, user_agent: userAgent },
    result,
    timestamp: new Date().toISOString(),
  });
}
```

---

## Version History

| Version | Date       | Changes                             |
| ------- | ---------- | ----------------------------------- |
| 1.0.0   | 2026-02-22 | Initial audit log policy created    |
