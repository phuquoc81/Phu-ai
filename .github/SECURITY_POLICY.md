# GitHub Security Policy

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Repository:** phuquoc81/Phu-ai  

---

## Overview

This document outlines the GitHub-specific security guidelines and policies for the Phu-ai repository. It complements the [main SECURITY.md](../SECURITY.md) file.

---

## Branch Protection Rules

The `main` branch is protected with the following rules:

- ✅ Require pull request reviews before merging (minimum 1 reviewer)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require signed commits
- ✅ Include administrators in these restrictions
- ✅ Restrict who can push to matching branches

---

## GitHub Actions Security

### Workflow Permissions

All GitHub Actions workflows follow the principle of least privilege:

- Default token permissions are set to `read-only`
- Workflows explicitly declare required permissions
- No workflows use `GITHUB_TOKEN` with write permissions unless necessary
- Secrets are never logged or exposed in workflow outputs

### Approved Actions

Only the following GitHub Actions are approved for use:

| Action                      | Version | Purpose                        |
| --------------------------- | ------- | ------------------------------ |
| `actions/checkout`          | v4      | Repository checkout            |
| `actions/setup-node`        | v4      | Node.js setup                  |
| `actions/upload-artifact`   | v4      | Artifact storage               |
| `actions/download-artifact` | v4      | Artifact retrieval             |
| `azure/webapps-deploy`      | v2      | Azure deployment               |

### Secrets Management

- All sensitive values must be stored as GitHub repository secrets
- Secrets must never be hardcoded in workflow files or source code
- Secrets should be rotated regularly (minimum every 90 days)
- Only necessary secrets should be granted to each workflow

---

## Dependency Management

### Automated Updates

The repository uses **Dependabot** to automatically:
- Monitor npm dependencies for security vulnerabilities
- Monitor GitHub Actions for outdated versions
- Create pull requests for dependency updates
- Alert maintainers about critical vulnerabilities

### Dependency Review

All dependency updates must:
- Pass automated security scans
- Be reviewed by a maintainer before merging
- Not introduce new known vulnerabilities
- Be pinned to specific versions (not ranges) for production dependencies

---

## Code Review Requirements

### Security-Sensitive Changes

Changes to the following areas require additional security review:

- Authentication and authorization logic
- Input validation and sanitization
- Cryptographic operations
- Database queries and data access
- File upload and processing
- API endpoints and rate limiting
- Security headers and CSP configuration
- Secrets and credentials handling

### Review Checklist

Security reviewers should verify:

- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all user-supplied data
- [ ] Output encoding to prevent XSS
- [ ] Proper error handling without information leakage
- [ ] Principle of least privilege applied
- [ ] No unnecessary data collection or storage
- [ ] Dependencies are up-to-date and free of known vulnerabilities
- [ ] Security headers are properly configured
- [ ] Logging does not expose sensitive information

---

## Issue Reporting and Handling

### Security Issues

- Security vulnerabilities must **NOT** be reported as public GitHub issues
- Use [GitHub Security Advisories](https://github.com/phuquoc81/Phu-ai/security/advisories/new) for private reporting
- Security issues are triaged within 48 hours

### Public Issues

Public issues are appropriate for:
- Bug reports (non-security)
- Feature requests
- Documentation improvements
- General questions

---

## Access Control

### Repository Access Levels

| Role        | Permissions                                           |
| ----------- | ----------------------------------------------------- |
| Owner       | Full access including deletion and billing            |
| Maintainer  | Full access except billing and deletion               |
| Contributor | Write access to non-protected branches                |
| Viewer      | Read-only access                                      |

### Access Review

- Repository access is reviewed quarterly
- Former contributors have their access revoked promptly
- Unused deploy keys and OAuth tokens are removed regularly

---

## Security Scanning

The following automated security scans are configured:

| Tool         | Purpose                                    | Frequency    |
| ------------ | ------------------------------------------ | ------------ |
| Dependabot   | Dependency vulnerability scanning          | Daily        |
| CodeQL       | Static code analysis                       | On push/PR   |
| Secret Scan  | Hardcoded secrets detection                | On push      |
| Security.yml | Custom security workflow                   | Weekly       |

---

## Incident Response

In the event of a security incident involving this GitHub repository:

1. **Immediate Actions**: Revoke compromised credentials, rotate secrets
2. **Assessment**: Determine scope and impact of the incident
3. **Containment**: Remove malicious code or unauthorized access
4. **Recovery**: Restore from known-good state if needed
5. **Notification**: Inform affected parties as required by law
6. **Post-Incident Review**: Document lessons learned and implement improvements

For detailed incident response procedures, see [INCIDENT_RESPONSE.md](../INCIDENT_RESPONSE.md).

---

## Contact

**Repository Owner:** [@phuquoc81](https://github.com/phuquoc81)  
**Security Advisories:** https://github.com/phuquoc81/Phu-ai/security/advisories  
**Main Security Policy:** [SECURITY.md](../SECURITY.md)  

---

## Version History

| Version | Date       | Changes                                |
| ------- | ---------- | -------------------------------------- |
| 1.0.0   | 2026-02-22 | Initial GitHub security policy created |
