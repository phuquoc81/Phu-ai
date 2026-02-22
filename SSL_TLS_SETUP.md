# SSL/TLS Setup Guide

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application (Azure Web App)  

---

## Table of Contents

1. [Overview](#overview)
2. [SSL/TLS Requirements](#ssltls-requirements)
3. [Azure Web App SSL/TLS Setup](#azure-web-app-ssltls-setup)
4. [Custom Domain and Certificate](#custom-domain-and-certificate)
5. [Free Certificate with Let's Encrypt](#free-certificate-with-lets-encrypt)
6. [Certificate Verification](#certificate-verification)
7. [Forced HTTPS Redirection](#forced-https-redirection)
8. [TLS Configuration Best Practices](#tls-configuration-best-practices)
9. [Certificate Renewal](#certificate-renewal)
10. [Troubleshooting](#troubleshooting)

---

## 1. Overview

Phu-ai is deployed on Microsoft Azure Web Apps, which provides built-in SSL/TLS support. This guide covers setting up and configuring SSL/TLS certificates for both the default Azure domain and custom domains.

**Default Azure Domain:** `https://phuoptimizer81.azurewebsites.net`  
The default `.azurewebsites.net` domain automatically receives a valid SSL certificate managed by Microsoft Azure.

---

## 2. SSL/TLS Requirements

| Requirement                    | Value                                   |
| ------------------------------ | --------------------------------------- |
| Minimum TLS Version            | TLS 1.2                                 |
| Preferred TLS Version          | TLS 1.3                                 |
| Certificate Type               | DV (Domain Validation) minimum          |
| Minimum Key Size               | RSA 2048-bit / ECDSA 256-bit            |
| Certificate Validity           | Maximum 1 year (recommended 90 days)    |
| HSTS Max-Age                   | 31536000 (1 year) minimum               |
| OCSP Stapling                  | Enabled                                 |
| HTTP/2                         | Enabled                                 |

---

## 3. Azure Web App SSL/TLS Setup

### 3.1 Minimum TLS Version

Configure minimum TLS version in Azure Portal:

1. Open Azure Portal → Your Web App
2. Navigate to **Settings** → **Configuration** → **General settings**
3. Under **Minimum Inbound TLS Version**, select **1.2**
4. Click **Save**

Or using Azure CLI:
```bash
az webapp config set \
  --name phuoptimizer81 \
  --resource-group <your-resource-group> \
  --min-tls-version 1.2
```

### 3.2 Enable HTTPS Only

1. Azure Portal → Your Web App → **Settings** → **Configuration** → **General settings**
2. Turn on **HTTPS Only**
3. Click **Save**

Or using Azure CLI:
```bash
az webapp update \
  --name phuoptimizer81 \
  --resource-group <your-resource-group> \
  --https-only true
```

---

## 4. Custom Domain and Certificate

### 4.1 Add Custom Domain

1. Azure Portal → Your Web App → **Custom domains**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow verification steps (CNAME or A record)
5. Click **Validate** then **Add custom domain**

### 4.2 Upload Your Certificate

1. Azure Portal → Your Web App → **Certificates**
2. Click **+ Add certificate**
3. Select **Upload certificate (.pfx)**
4. Upload your .pfx file and enter the password
5. Click **Validate** then **Add**

### 4.3 Bind Certificate to Domain

1. Azure Portal → Your Web App → **Custom domains**
2. Find your custom domain, click **Add binding**
3. Select your certificate from the dropdown
4. Choose TLS/SSL Type: **SNI SSL**
5. Click **Add binding**

---

## 5. Free Certificate with Let's Encrypt

Azure Web Apps supports free managed certificates:

### Using Azure's Free Managed Certificate

1. Azure Portal → Your Web App → **Certificates**
2. Click **+ Add certificate**
3. Select **Create App Service Managed Certificate**
4. Select your custom domain
5. Click **Create**

**Requirements for managed certificates:**
- Custom domain must already be added to the Web App
- Domain must be publicly accessible
- Supports only `*.azurewebsites.net` and custom domains

### Using Certbot (Manual)

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
certbot certonly --manual \
  --preferred-challenges=dns \
  -d yourdomain.com \
  -d www.yourdomain.com

# Files will be in /etc/letsencrypt/live/yourdomain.com/
# Convert to PFX for Azure upload:
openssl pkcs12 -export \
  -out certificate.pfx \
  -inkey privkey.pem \
  -in cert.pem \
  -certfile chain.pem
```

---

## 6. Certificate Verification

### Verify SSL Certificate

```bash
# Check certificate details
openssl s_client -connect yourdomain.com:443 -showcerts

# Check certificate expiry
echo | openssl s_client -connect yourdomain.com:443 2>/dev/null \
  | openssl x509 -noout -dates

# Check certificate chain
openssl s_client -connect yourdomain.com:443 -verify_return_error
```

### Online Tools

| Tool                    | URL                                             |
| ----------------------- | ----------------------------------------------- |
| SSL Labs                | https://www.ssllabs.com/ssltest/                |
| Why No Padlock?         | https://www.whynopadlock.com/                   |
| SSL Checker             | https://www.sslshopper.com/ssl-checker.html     |
| DigiCert SSL Checker    | https://www.digicert.com/help/                  |

**Target SSL Labs Grade:** A+

---

## 7. Forced HTTPS Redirection

### Azure Web App (HTTPS Only)

The recommended approach is to enable HTTPS Only in Azure (see Section 3.2).

### Node.js Application Level

```javascript
// Force HTTPS in Node.js/Express
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(301, `https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### web.config (IIS)

```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Redirect to HTTPS" stopProcessing="true">
          <match url="(.*)" />
          <conditions>
            <add input="{HTTPS}" pattern="off" ignoreCase="true" />
          </conditions>
          <action type="Redirect" url="https://{HTTP_HOST}/{R:1}"
            redirectType="Permanent" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

## 8. TLS Configuration Best Practices

### Cipher Suites

Prefer these cipher suites (Azure manages this automatically for App Services):

**TLS 1.3 (best):**
- `TLS_AES_256_GCM_SHA384`
- `TLS_AES_128_GCM_SHA256`
- `TLS_CHACHA20_POLY1305_SHA256`

**TLS 1.2 (acceptable):**
- `ECDHE-RSA-AES256-GCM-SHA384`
- `ECDHE-RSA-AES128-GCM-SHA256`

### Avoid

- SSLv2, SSLv3 (deprecated, insecure)
- TLS 1.0, TLS 1.1 (deprecated)
- RC4 cipher suites
- CBC cipher suites with SHA1

### Certificate Pinning

For high-security applications, consider implementing HTTP Public Key Pinning (HPKP) or certificate pinning in mobile clients. **Note:** HPKP is deprecated; prefer Certificate Transparency and monitoring.

---

## 9. Certificate Renewal

See [CERTIFICATE_MANAGEMENT.md](CERTIFICATE_MANAGEMENT.md) for detailed renewal procedures.

**Summary:**
- Azure managed certificates auto-renew 30 days before expiry
- Let's Encrypt certificates expire every 90 days; automate renewal with certbot
- Monitor expiry dates and set up alerts at 30 days before expiry

---

## 10. Troubleshooting

### Certificate Not Trusted

**Cause:** Missing intermediate certificate in the chain.

**Fix:** Ensure your certificate file includes the full chain (leaf cert + intermediates + root).

### Mixed Content Errors

**Cause:** HTTPS page loading HTTP resources.

**Fix:**
1. Update all resource URLs to HTTPS
2. Use protocol-relative URLs (`//example.com/resource.js`)
3. Enable `upgrade-insecure-requests` in CSP

### Certificate Name Mismatch

**Cause:** Certificate doesn't match the domain being accessed.

**Fix:** Ensure the certificate covers both `yourdomain.com` and `www.yourdomain.com` (use SAN certificate).

### TLS Handshake Failures

**Cause:** Client doesn't support the configured TLS version.

**Fix:** Ensure TLS 1.2+ is supported by your target browsers/clients.

---

## Version History

| Version | Date       | Changes                          |
| ------- | ---------- | -------------------------------- |
| 1.0.0   | 2026-02-22 | Initial SSL/TLS setup guide      |
