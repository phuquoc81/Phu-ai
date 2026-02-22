# Incident Response Plan

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  
**Classification:** Internal  

---

## Table of Contents

1. [Overview](#overview)
2. [Incident Classification](#incident-classification)
3. [Incident Response Team](#incident-response-team)
4. [Response Phases](#response-phases)
5. [Specific Incident Playbooks](#specific-incident-playbooks)
6. [Communication Plan](#communication-plan)
7. [Recovery Procedures](#recovery-procedures)
8. [Post-Incident Review](#post-incident-review)
9. [Incident Reporting Templates](#incident-reporting-templates)
10. [Contact Directory](#contact-directory)

---

## 1. Overview

This Incident Response Plan (IRP) defines the procedures for detecting, responding to, and recovering from security incidents affecting the Phu-ai web application. The goal is to minimize the impact of incidents on users, data, and service availability.

### Objectives

1. Rapidly detect and contain security incidents
2. Minimize damage and unauthorized data access
3. Restore normal operations as quickly as possible
4. Comply with legal notification requirements
5. Learn from incidents to prevent recurrence

---

## 2. Incident Classification

### Severity Levels

| Severity   | Definition                                                                     | Response Time  | Examples                                    |
| ---------- | ------------------------------------------------------------------------------ | -------------- | ------------------------------------------- |
| **P1 – Critical** | Service completely down or active security breach with data exfiltration | Immediate (< 1 hour) | Data breach, ransomware, complete outage |
| **P2 – High**     | Significant security incident or major degradation                      | < 4 hours      | Account takeover, SQL injection attack      |
| **P3 – Medium**   | Limited security impact or partial degradation                          | < 24 hours     | XSS attack, minor data leak, performance    |
| **P4 – Low**      | Minimal security impact or minor issue                                  | < 72 hours     | Suspicious activity, minor bug              |

### Incident Categories

- **Category A: Data Breach** – Unauthorized access to or disclosure of user data
- **Category B: Service Disruption** – DoS, DDoS, or infrastructure failure
- **Category C: Account Compromise** – Unauthorized access to user or admin accounts
- **Category D: Malware/Ransomware** – Malicious software infection
- **Category E: Vulnerability Exploitation** – Active exploitation of application vulnerabilities
- **Category F: Insider Threat** – Malicious or negligent action by authorized users
- **Category G: Third-Party Incident** – Security incident at a vendor or service provider

---

## 3. Incident Response Team

### Core Team

| Role                     | Responsibility                                       | Contact                                  |
| ------------------------ | ---------------------------------------------------- | ---------------------------------------- |
| Incident Commander       | Overall incident management and coordination         | [@phuquoc81](https://github.com/phuquoc81) |
| Security Lead            | Technical security investigation and containment     | [@phuquoc81](https://github.com/phuquoc81) |
| Operations Lead          | Infrastructure and service restoration               | [@phuquoc81](https://github.com/phuquoc81) |
| Communications Lead      | Internal and external communications                 | [@phuquoc81](https://github.com/phuquoc81) |

### Escalation Matrix

| Incident Level    | Notify                              |
| ----------------- | ----------------------------------- |
| P4 (Low)          | Operations team                     |
| P3 (Medium)       | Operations + Security team          |
| P2 (High)         | All team + Management               |
| P1 (Critical)     | All team + Management + Legal       |

---

## 4. Response Phases

### Phase 1: Detection and Identification

**Trigger Sources:**
- Automated monitoring alerts
- User or customer reports
- GitHub security advisory submissions
- Third-party security researchers
- Internal team discovery

**Actions:**
1. Receive and log the alert/report
2. Assign initial severity level
3. Assign an Incident Commander
4. Begin incident log (see template in Section 9)
5. Initial investigation to confirm whether it is a genuine incident
6. Escalate if severity increases

**Time Target:** Complete within 1 hour (P1/P2) or 24 hours (P3/P4)

---

### Phase 2: Containment

**Short-term Containment (immediate):**
- Isolate affected systems if necessary
- Block malicious IP addresses
- Disable compromised accounts
- Revoke compromised credentials/tokens
- Enable enhanced logging

**Long-term Containment (maintain operations):**
- Apply temporary patches or workarounds
- Implement additional monitoring
- Restrict affected features if necessary

**Evidence Preservation:**
- Capture system state, memory dumps if needed
- Preserve log files
- Document all actions taken with timestamps

---

### Phase 3: Eradication

**Actions:**
1. Identify root cause of the incident
2. Remove malicious code, backdoors, or unauthorized access
3. Patch exploited vulnerabilities
4. Change all potentially compromised credentials
5. Scan for similar vulnerabilities in related systems

---

### Phase 4: Recovery

**Actions:**
1. Restore affected systems from known-good backups
2. Gradually restore services (monitor carefully)
3. Verify system integrity before bringing services back online
4. Confirm resolution with testing
5. Remove temporary security measures (if no longer needed)
6. Return to normal operations

**Recovery Validation:**
- [ ] No malicious code present
- [ ] Root cause addressed
- [ ] Credentials rotated
- [ ] Services functioning normally
- [ ] Enhanced monitoring in place
- [ ] Users/customers notified (if applicable)

---

### Phase 5: Post-Incident Review

See [Section 8: Post-Incident Review](#post-incident-review).

---

## 5. Specific Incident Playbooks

### 5.1 Data Breach Playbook

**Indicators:**
- Unusual data access patterns in logs
- Large data exports
- Reports of customer data appearing elsewhere
- Security researcher notification

**Response Steps:**
1. Immediately isolate the affected system/data store
2. Identify what data was accessed and by whom
3. Determine the extent of the breach (records, time period)
4. Preserve evidence and logs
5. Notify relevant authorities within 72 hours (GDPR requirement)
6. Notify affected individuals if high risk
7. Engage legal counsel

### 5.2 Account Compromise Playbook

**Indicators:**
- Login from unusual geographic location
- Multiple failed logins followed by success
- Unexpected password resets
- Unusual account activity

**Response Steps:**
1. Immediately suspend compromised account(s)
2. Invalidate all active sessions for the account
3. Reset credentials (force password reset)
4. Notify the account owner
5. Review activity logs for unauthorized actions
6. Revert any unauthorized changes

### 5.3 DDoS Attack Playbook

**Indicators:**
- Significant traffic spike
- Service unresponsive or slow
- High CPU/bandwidth utilization

**Response Steps:**
1. Confirm it's a DDoS (not legitimate traffic spike)
2. Enable Azure DDoS Protection
3. Implement rate limiting
4. Block attacking IP ranges
5. Scale resources if economically feasible
6. Contact Azure support if attack is severe

### 5.4 Vulnerability Exploitation Playbook

**Indicators:**
- Unexpected SQL errors in logs
- Code execution traces
- Unexpected output from the application
- Security researcher report

**Response Steps:**
1. Identify the vulnerability being exploited
2. Temporarily disable affected feature/endpoint
3. Apply emergency patch or workaround
4. Conduct full code audit for similar issues
5. Deploy patched version
6. Re-enable affected feature after verification

---

## 6. Communication Plan

### Internal Communications

- **P1/P2:** Immediate Slack/Teams notification to all team members
- **P3:** Same-day email notification
- **P4:** Next business day notification

### External Communications

#### For Data Breaches Affecting Users:

**GDPR Requirements (EU/EEA users):**
- Notify supervisory authority within **72 hours** of discovery
- Notify affected individuals "without undue delay" if high risk

**Notification Template:**
```
Subject: Important Security Notice from Phu-ai

Dear [User/Customer],

We are writing to inform you of a security incident that may have affected your account.

What happened: [Clear description of the incident]
What data was affected: [Specific data types]
What we have done: [Actions taken to address the incident]
What you should do: [Specific steps for users]

We sincerely apologize for this incident and the concern it may cause.

For questions, please contact: [Contact information]

Phu-ai Security Team
```

---

## 7. Recovery Procedures

### Service Restoration Priority

1. **Core authentication** – Users must be able to securely log in
2. **Data integrity** – Ensure no data corruption
3. **Core functionality** – Main AI features
4. **Secondary features** – Additional features

### Backup Recovery

```bash
# Azure App Service backup restoration
az webapp config backup restore \
  --backup-name <backup-name> \
  --db-connection-string-type <type> \
  --name phuoptimizer81 \
  --resource-group <your-resource-group>

# Verify restoration
az webapp show \
  --name phuoptimizer81 \
  --resource-group <your-resource-group>
```

---

## 8. Post-Incident Review

### Review Timeline

- **P1/P2:** Post-incident review within 48 hours
- **P3/P4:** Post-incident review within 1 week

### Review Topics

1. **Timeline reconstruction**: What happened and when?
2. **Root cause analysis**: What was the underlying cause?
3. **Detection effectiveness**: How was the incident detected? Could it have been detected sooner?
4. **Response effectiveness**: Was the response timely and appropriate?
5. **Impact assessment**: What was the actual impact on users and the service?
6. **Lessons learned**: What can we improve?
7. **Action items**: What specific changes will be made?

### Review Document

Produce a post-incident report including:
- Incident summary (severity, category, duration)
- Timeline of events
- Root cause analysis
- Impact assessment
- Response actions taken
- Lessons learned
- Action items with owners and deadlines

---

## 9. Incident Reporting Templates

### Initial Incident Report

```
INCIDENT REPORT
===============
Date/Time Detected: 
Reported By: 
Incident ID: INC-{YYYY-MM-DD}-{NUMBER}
Severity: P[1/2/3/4]
Category: 
Status: [New / In Progress / Contained / Resolved]

Summary:
(Brief description of what happened)

Current Impact:
(What systems/users are affected)

Immediate Actions Taken:
(Actions taken since detection)

Next Steps:
(Planned actions)

Incident Commander: 
```

---

## 10. Contact Directory

| Role                    | Contact                                              |
| ----------------------- | ---------------------------------------------------- |
| Project Owner           | [@phuquoc81](https://github.com/phuquoc81)           |
| Security Reports        | https://github.com/phuquoc81/Phu-ai/security/advisories |
| Azure Support           | https://portal.azure.com/#blade/Microsoft_Azure_Support |
| GitHub Support          | https://support.github.com/                          |

---

## Version History

| Version | Date       | Changes                              |
| ------- | ---------- | ------------------------------------ |
| 1.0.0   | 2026-02-22 | Initial incident response plan       |
