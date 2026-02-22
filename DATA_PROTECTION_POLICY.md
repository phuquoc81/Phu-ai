# Data Protection Policy

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Effective Date:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Table of Contents

1. [Introduction and Scope](#introduction-and-scope)
2. [Data Protection Principles](#data-protection-principles)
3. [Roles and Responsibilities](#roles-and-responsibilities)
4. [Data Classification](#data-classification)
5. [Data Collection and Lawful Basis](#data-collection-and-lawful-basis)
6. [Data Minimization and Purpose Limitation](#data-minimization-and-purpose-limitation)
7. [Data Security](#data-security)
8. [Data Retention and Deletion](#data-retention-and-deletion)
9. [Data Subject Rights](#data-subject-rights)
10. [Third-Party Data Processors](#third-party-data-processors)
11. [International Data Transfers](#international-data-transfers)
12. [Data Breach Response](#data-breach-response)
13. [GDPR Compliance](#gdpr-compliance)
14. [CCPA Compliance](#ccpa-compliance)
15. [Children's Data Protection](#childrens-data-protection)
16. [AI and Automated Decision-Making](#ai-and-automated-decision-making)
17. [Policy Review](#policy-review)
18. [Contact Information](#contact-information)

---

## 1. Introduction and Scope

### 1.1 Purpose
This Data Protection Policy establishes the framework for how Phu-ai collects, processes, stores, and protects personal data. It demonstrates our commitment to GDPR, CCPA, and other applicable data protection regulations.

### 1.2 Scope
This policy applies to:
- All personal data processed by the Phu-ai Service
- All users of the Service regardless of location
- All contractors and service providers who process data on our behalf

### 1.3 Regulatory Framework
This policy is designed to comply with:
- **GDPR** (EU General Data Protection Regulation) – Regulation (EU) 2016/679
- **CCPA** (California Consumer Privacy Act)
- **VCDPA** (Virginia Consumer Data Protection Act)
- **CPRA** (California Privacy Rights Act)
- Other applicable national and international data protection laws

---

## 2. Data Protection Principles

We adhere to the following data protection principles (aligned with GDPR Article 5):

### 2.1 Lawfulness, Fairness, and Transparency
- Data is processed lawfully with a valid legal basis
- Processing is fair and does not adversely affect data subjects
- Data subjects are informed about processing activities

### 2.2 Purpose Limitation
- Data is collected for specified, explicit, and legitimate purposes
- Data is not further processed in ways incompatible with original purposes

### 2.3 Data Minimization
- Only data necessary for the specific purpose is collected
- Excessive data collection is avoided

### 2.4 Accuracy
- Data is accurate and kept up to date
- Inaccurate data is erased or corrected without delay

### 2.5 Storage Limitation
- Data is kept in identifiable form only as long as necessary
- Retention periods are defined and enforced

### 2.6 Integrity and Confidentiality
- Data is processed securely using appropriate technical and organizational measures
- Data is protected against unauthorized access, loss, or destruction

### 2.7 Accountability
- We are responsible for and can demonstrate compliance with these principles
- Data protection is built into processes by design and default

---

## 3. Roles and Responsibilities

### 3.1 Data Controller
Phuquoc81 acts as the **Data Controller** for personal data processed through the Service. As Data Controller, we:
- Determine the purposes and means of processing
- Are responsible for compliance with data protection laws
- Maintain records of processing activities

### 3.2 Data Processors
Third-party service providers who process data on our behalf are **Data Processors**. We ensure:
- Data Processing Agreements (DPAs) are in place with all processors
- Processors provide sufficient guarantees of data protection
- Processors are only authorized to process data as instructed

### 3.3 Data Protection Officer (DPO)
While not legally required for all organizations, we designate a point of contact for data protection matters. Contact information is provided in Section 18.

---

## 4. Data Classification

We classify data into the following categories:

| Classification    | Description                                           | Examples                                      |
| ----------------- | ----------------------------------------------------- | --------------------------------------------- |
| **Public**        | Information intended for public disclosure            | Project documentation, public code             |
| **Internal**      | Information for internal use only                     | Internal configurations, non-public logs       |
| **Confidential**  | Sensitive business information                        | User analytics, performance data               |
| **Personal**      | Any information relating to an identified individual  | Names, emails, IP addresses                    |
| **Sensitive**     | Special categories requiring extra protection         | Health data, racial/ethnic origin (if any)     |

### 4.1 Special Categories of Personal Data
We do **not** intentionally collect special categories of personal data (GDPR Article 9), including:
- Racial or ethnic origin
- Political opinions
- Religious beliefs
- Trade union membership
- Genetic data
- Biometric data
- Health data
- Sexual orientation

If such data is inadvertently provided, it will be deleted promptly.

---

## 5. Data Collection and Lawful Basis

### 5.1 Categories of Personal Data Collected

| Category              | Data Elements                                    | Legal Basis (GDPR)             |
| --------------------- | ------------------------------------------------ | ------------------------------ |
| Identity data         | Username, name                                   | Contract / Consent             |
| Contact data          | Email address                                    | Contract / Consent             |
| Technical data        | IP address, device info, browser type            | Legitimate interests            |
| Usage data            | Pages visited, features used, interactions       | Legitimate interests            |
| Content data          | AI queries, user-submitted content               | Contract                       |
| Authentication data   | OAuth tokens (not passwords – hashed)            | Contract                       |

### 5.2 Lawful Bases for Processing

| Processing Purpose               | Lawful Basis                        |
| -------------------------------- | ----------------------------------- |
| Account creation and management  | Contract (Art. 6(1)(b))             |
| Service provision                | Contract (Art. 6(1)(b))             |
| Security and fraud prevention    | Legitimate interests (Art. 6(1)(f)) |
| Legal compliance                 | Legal obligation (Art. 6(1)(c))     |
| Service improvement and research | Legitimate interests (Art. 6(1)(f)) |
| Marketing (if applicable)        | Consent (Art. 6(1)(a))              |

---

## 6. Data Minimization and Purpose Limitation

- We collect only the minimum data necessary for each purpose
- Data collected for one purpose will not be used for unrelated purposes without additional legal basis or consent
- Regular reviews are conducted to ensure data minimization principles are maintained
- Data fields that are no longer necessary are removed from collection

---

## 7. Data Security

### 7.1 Technical Measures
- **Encryption**: All personal data encrypted in transit (TLS 1.2+) and at rest (AES-256)
- **Access Control**: Role-based access control; minimum necessary permissions
- **Authentication**: Multi-factor authentication for administrative access
- **Monitoring**: Continuous security monitoring and anomaly detection
- **Vulnerability Management**: Regular security scanning and patch management
- **Backup**: Encrypted backups with tested recovery procedures

### 7.2 Organizational Measures
- Security awareness training for all personnel
- Background checks for personnel with access to personal data
- Documented security policies and procedures
- Regular security audits and penetration testing
- Incident response procedures (see [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md))

### 7.3 Privacy by Design and Default
- Privacy is considered from the earliest stages of any new processing activity
- Default settings protect privacy (e.g., minimal data collection, not sharing data by default)
- Privacy Impact Assessments (PIAs) are conducted for high-risk processing activities

---

## 8. Data Retention and Deletion

### 8.1 Retention Schedule

| Data Category          | Retention Period                               | Deletion Method         |
| ---------------------- | ---------------------------------------------- | ----------------------- |
| Account data           | Duration of account + 30 days after deletion   | Secure deletion         |
| User content           | Duration of account + 30 days                  | Secure deletion         |
| Usage logs             | 90 days                                        | Automatic deletion      |
| Security audit logs    | 1 year                                         | Automatic deletion      |
| Legal compliance data  | As required by applicable law                  | Secure deletion         |
| Backup data            | 30 days                                        | Automatic rotation      |
| Financial records      | 7 years (tax/legal requirement)                | Secure archival         |

### 8.2 Deletion Process
- Data is securely deleted using methods appropriate for the storage medium
- Deletion is verified and logged
- Backup copies are deleted within the backup retention period

---

## 9. Data Subject Rights

Users have the following rights regarding their personal data:

### 9.1 Right to Access (GDPR Art. 15 / CCPA)
- Request confirmation of whether we process your data
- Request a copy of your personal data
- We will respond within 30 days (GDPR) or 45 days (CCPA)

### 9.2 Right to Rectification (GDPR Art. 16)
- Request correction of inaccurate personal data
- Request completion of incomplete personal data

### 9.3 Right to Erasure / Right to Be Forgotten (GDPR Art. 17 / CCPA)
- Request deletion of your personal data
- Applicable unless legal basis for retention exists

### 9.4 Right to Restriction of Processing (GDPR Art. 18)
- Request that we restrict processing while accuracy is contested or objection is considered

### 9.5 Right to Data Portability (GDPR Art. 20)
- Receive your data in a structured, commonly used, machine-readable format
- Request transmission of data to another controller

### 9.6 Right to Object (GDPR Art. 21)
- Object to processing based on legitimate interests
- Object to direct marketing at any time

### 9.7 Rights Related to Automated Decision-Making (GDPR Art. 22)
- Right not to be subject to solely automated decisions with significant effects
- Right to human review of automated decisions

### 9.8 Exercising Your Rights
To exercise any right:
1. Submit a request via [GitHub Issues](https://github.com/phuquoc81/Phu-ai/issues)
2. We will verify your identity before fulfilling the request
3. We will respond within the legally required timeframe

---

## 10. Third-Party Data Processors

We use the following third-party data processors:

| Processor         | Purpose                              | Data Shared           | Location              |
| ----------------- | ------------------------------------ | --------------------- | --------------------- |
| Microsoft Azure   | Hosting and infrastructure           | All service data      | Global (Azure regions)|
| GitHub            | Source code management               | Developer data        | USA (GitHub servers)  |

All processors are bound by Data Processing Agreements (DPAs) ensuring compliance with GDPR and applicable laws.

---

## 11. International Data Transfers

When transferring personal data outside the EU/EEA, we ensure appropriate safeguards:

- **Standard Contractual Clauses (SCCs)**: EU-approved contractual protections
- **Adequacy Decisions**: Transfers to countries with adequate data protection
- **Binding Corporate Rules**: For transfers within corporate groups
- **Derogations**: For specific situations as permitted by GDPR Art. 49

---

## 12. Data Breach Response

### 12.1 Detection and Assessment
- Security monitoring detects potential breaches
- Breaches are assessed for severity and scope within 24 hours

### 12.2 Notification Requirements

| Breach Type                           | Notification Requirement                                         |
| ------------------------------------- | ---------------------------------------------------------------- |
| Risk to individuals                   | Supervisory authority within 72 hours (GDPR)                     |
| High risk to individuals              | Affected individuals without undue delay                         |
| CCPA breach                           | Affected California residents in most expedient time              |

### 12.3 Documentation
All breaches are documented regardless of notification requirements. See [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md) for detailed procedures.

---

## 13. GDPR Compliance

### 13.1 Record of Processing Activities (ROPA)
We maintain a ROPA as required by GDPR Article 30, documenting:
- Categories of data subjects and personal data
- Purposes of processing
- Recipients of personal data
- International transfers
- Retention periods
- Security measures

### 13.2 Privacy Impact Assessments (DPIA)
Data Protection Impact Assessments are conducted for:
- New processing activities involving high risk
- Processing using new technologies
- Large-scale processing of sensitive data
- Systematic monitoring of public areas

### 13.3 Consent Management
- Consent is freely given, specific, informed, and unambiguous
- Consent is recorded and can be withdrawn at any time
- Withdrawal of consent does not affect lawfulness of prior processing

---

## 14. CCPA Compliance

### 14.1 Consumer Rights
California residents have rights under CCPA/CPRA to:
- Know what personal information is collected
- Delete personal information
- Opt-out of sale of personal information
- Non-discrimination for exercising rights
- Correct inaccurate personal information (CPRA)
- Limit use of sensitive personal information (CPRA)

### 14.2 "Do Not Sell"
We do not sell personal information as defined by CCPA. If this changes, we will update this policy and implement opt-out mechanisms.

---

## 15. Children's Data Protection

- The Service is not directed to children under 13 (or 16 in EU/EEA)
- We do not knowingly collect data from children without parental consent
- If we discover we have collected a child's data without consent, it is promptly deleted
- Parents/guardians can request deletion of their child's data

---

## 16. AI and Automated Decision-Making

### 16.1 AI Processing
- User queries are processed by AI systems to generate responses
- AI processing is conducted with appropriate safeguards
- AI outputs are not used for automated decisions with significant legal effects

### 16.2 Human Oversight
- AI-generated content is provided as information, not authoritative decisions
- High-risk decisions require human review
- Users are informed when interacting with AI systems

---

## 17. Policy Review

This policy is reviewed:
- Annually as a standard review
- When significant changes occur in processing activities
- When required by changes in applicable law
- After security incidents

---

## 18. Contact Information

**Data Controller:** Phuquoc81  
**GitHub:** [@phuquoc81](https://github.com/phuquoc81)  
**Repository:** https://github.com/phuquoc81/Phu-ai  
**Privacy Questions:** https://github.com/phuquoc81/Phu-ai/issues  
**Security Issues:** https://github.com/phuquoc81/Phu-ai/security/advisories/new  

---

## Version History

| Version | Date       | Changes                                    |
| ------- | ---------- | ------------------------------------------ |
| 1.0.0   | 2026-02-22 | Initial data protection policy created     |
