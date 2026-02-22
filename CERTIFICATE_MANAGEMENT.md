# Certificate Management and Renewal

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  

---

## Table of Contents

1. [Overview](#overview)
2. [Certificate Inventory](#certificate-inventory)
3. [Certificate Lifecycle](#certificate-lifecycle)
4. [Monitoring and Alerts](#monitoring-and-alerts)
5. [Renewal Procedures](#renewal-procedures)
6. [Emergency Certificate Replacement](#emergency-certificate-replacement)
7. [Certificate Revocation](#certificate-revocation)
8. [Key Management](#key-management)
9. [Audit and Compliance](#audit-and-compliance)

---

## 1. Overview

This document outlines the procedures for managing SSL/TLS certificates used by the Phu-ai web application. Proper certificate management ensures continuous availability of HTTPS and prevents service disruptions from expired certificates.

---

## 2. Certificate Inventory

### Active Certificates

| Domain / Service              | Certificate Type         | CA                    | Expiry           | Auto-Renew    | Owner         |
| ----------------------------- | ------------------------ | --------------------- | ---------------- | ------------- | ------------- |
| *.azurewebsites.net           | Azure Managed            | DigiCert (via Azure)  | Auto-managed     | ✅ Yes         | Microsoft     |
| phuoptimizer81.azurewebsites.net | Azure App Service Cert | DigiCert (via Azure)  | Auto-managed     | ✅ Yes         | Microsoft     |
| Custom domain (if added)      | App Service Managed      | DigiCert (via Azure)  | ~1 year          | ✅ Yes         | Azure         |

### Certificate Store

Certificates are stored and managed in:
- **Azure Key Vault** (recommended for custom certificates)
- **Azure App Service Certificates** (for App Service managed certs)
- GitHub Actions Secrets (for CI/CD pipeline certificates)

---

## 3. Certificate Lifecycle

```
Generation → Validation → Installation → Monitoring → Renewal → Revocation
```

### Certificate Validity Periods

| Certificate Type         | Maximum Validity  | Recommended        |
| ------------------------ | ----------------- | ------------------ |
| DV (Domain Validation)   | 398 days          | 90 days            |
| OV (Organization Valid.) | 398 days          | 1 year             |
| EV (Extended Validation) | 398 days          | 1 year             |
| Let's Encrypt            | 90 days           | 90 days (auto)     |
| Azure Managed            | Auto-managed      | N/A                |
| Internal/Dev             | As needed         | 1 year max         |

---

## 4. Monitoring and Alerts

### Certificate Expiry Monitoring

Set up alerts for certificate expiry:

**Alert Thresholds:**
- **60 days before expiry**: Warning notification
- **30 days before expiry**: Action required notification
- **14 days before expiry**: Critical alert
- **7 days before expiry**: Emergency escalation

### Azure Monitor Setup

```bash
# Create Azure Monitor alert for certificate expiry
az monitor metrics alert create \
  --name "SSL-Certificate-Expiry-Warning" \
  --resource-group <your-resource-group> \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{rg}/providers/Microsoft.Web/sites/{app-name} \
  --condition "avg SslCertificateExpirationDate < 30" \
  --window-size 1d \
  --evaluation-frequency 1d
```

### Automated Monitoring Script

```bash
#!/bin/bash
# Check certificate expiry for a domain
DOMAIN="yourdomain.com"
THRESHOLD=30

EXPIRY=$(echo | openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} 2>/dev/null \
  | openssl x509 -noout -enddate 2>/dev/null \
  | cut -d= -f2)

EXPIRY_EPOCH=$(date -d "${EXPIRY}" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "${EXPIRY}" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

echo "Certificate for ${DOMAIN} expires in ${DAYS_LEFT} days (${EXPIRY})"

if [ ${DAYS_LEFT} -lt ${THRESHOLD} ]; then
  echo "⚠️  WARNING: Certificate expires in less than ${THRESHOLD} days!"
  exit 1
fi
```

---

## 5. Renewal Procedures

### 5.1 Azure Managed Certificate Renewal

Azure managed certificates auto-renew automatically:

**Verification:**
1. Azure Portal → App Service → Certificates
2. Check **Status** column shows "Issued"
3. Verify expiry date is in the future

**If auto-renewal fails:**
```bash
# Force renewal via Azure CLI
az webapp config ssl show \
  --name phuoptimizer81 \
  --resource-group <your-resource-group>

# Delete and recreate the managed certificate if needed
az webapp config ssl delete \
  --certificate-thumbprint <thumbprint> \
  --resource-group <your-resource-group>
```

### 5.2 Let's Encrypt Certificate Renewal

Let's Encrypt certificates expire every 90 days. Automate renewal:

**Install and configure Certbot auto-renewal:**
```bash
# Install certbot
sudo apt-get install certbot

# Set up automated renewal (runs twice daily)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run

# Actual renewal
sudo certbot renew
```

**Post-renewal hook to update Azure:**
```bash
# /etc/letsencrypt/renewal-hooks/deploy/update-azure.sh
#!/bin/bash
DOMAIN="yourdomain.com"
RESOURCE_GROUP="<your-resource-group>"
APP_NAME="phuoptimizer81"

# Convert to PFX
openssl pkcs12 -export \
  -out /tmp/certificate.pfx \
  -inkey /etc/letsencrypt/live/${DOMAIN}/privkey.pem \
  -in /etc/letsencrypt/live/${DOMAIN}/cert.pem \
  -certfile /etc/letsencrypt/live/${DOMAIN}/chain.pem \
  -passout pass:""

# Upload to Azure
az webapp config ssl upload \
  --certificate-file /tmp/certificate.pfx \
  --certificate-password "" \
  --name ${APP_NAME} \
  --resource-group ${RESOURCE_GROUP}

# Clean up
rm /tmp/certificate.pfx
```

### 5.3 Manual Certificate Renewal

For manually managed certificates:

1. **Generate new CSR:**
   ```bash
   openssl req -new -newkey rsa:2048 -nodes \
     -keyout new-private.key \
     -out new-certificate.csr \
     -subj "/CN=yourdomain.com/O=Phuquoc81/C=US"
   ```

2. **Submit CSR to CA** and complete domain validation

3. **Receive certificate** from CA

4. **Install new certificate** before old one expires

5. **Verify installation** using SSL checker tools

6. **Update inventory** in this document

---

## 6. Emergency Certificate Replacement

If a certificate is compromised or fails unexpectedly:

### Immediate Actions (< 4 hours)

1. **Revoke the compromised certificate** (see Section 7)
2. **Generate emergency certificate:**
   ```bash
   # Quick self-signed cert (temporary, 30 days)
   openssl req -x509 -newkey rsa:4096 -sha256 \
     -days 30 -nodes \
     -keyout emergency.key \
     -out emergency.crt \
     -subj "/CN=yourdomain.com"
   ```
3. **Install emergency certificate** on Azure
4. **Order proper replacement** from CA

### Recovery Steps

1. Obtain replacement certificate from CA (expedited)
2. Install replacement certificate
3. Remove emergency certificate
4. Verify service is fully restored
5. Document incident in [AUDIT_LOG_POLICY.md](AUDIT_LOG_POLICY.md)

---

## 7. Certificate Revocation

### When to Revoke

- Private key is compromised
- Certificate information is incorrect
- Domain ownership changes
- Service is discontinued

### Revocation Process

1. **Contact CA** to revoke the certificate
2. **Azure certificates**: Delete via Azure Portal or CLI
   ```bash
   az webapp config ssl delete \
     --certificate-thumbprint <thumbprint> \
     --resource-group <your-resource-group>
   ```
3. **Let's Encrypt**: `certbot revoke --cert-path /path/to/cert.pem`
4. **Issue replacement** immediately
5. **Notify affected parties** if there's a security incident

---

## 8. Key Management

### Private Key Security

- Private keys must **never** be transmitted over insecure channels
- Store private keys in Azure Key Vault or equivalent secure storage
- Restrict access to private keys to authorized personnel only
- Never commit private keys to source code repositories
- Rotate keys when renewing certificates (do not reuse old keys)

### Key Storage

| Storage Location      | Use Case                                    | Access Control             |
| --------------------- | ------------------------------------------- | -------------------------- |
| Azure Key Vault       | Production certificates and keys            | RBAC, Azure AD             |
| Azure App Service     | App Service managed certificates            | Azure AD, RBAC             |
| Local encrypted store | Development certificates only               | Password-protected          |

---

## 9. Audit and Compliance

### Certificate Audit Log

Maintain records of:
- Certificate issuance dates
- CA used
- Certificate fingerprints/thumbprints
- Installation dates and locations
- Renewal history
- Revocation events

### Compliance Requirements

| Standard   | Requirement                                              | Status      |
| ---------- | -------------------------------------------------------- | ----------- |
| PCI DSS    | Strong cryptography (TLS 1.2+)                          | ✅ Met       |
| GDPR       | Appropriate technical measures (encryption in transit)   | ✅ Met       |
| SOC 2      | Certificate lifecycle management                         | ✅ Met       |
| NIST       | Certificate management practices                         | ✅ Met       |

---

## Version History

| Version | Date       | Changes                                  |
| ------- | ---------- | ---------------------------------------- |
| 1.0.0   | 2026-02-22 | Initial certificate management guide     |
