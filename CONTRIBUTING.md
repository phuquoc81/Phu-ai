# Contributing to Phu-ai

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Project:** Phu-ai Web Application  

Thank you for your interest in contributing to Phu-ai! We welcome contributions from the community and appreciate all forms of participation.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Development Setup](#development-setup)
5. [Coding Standards](#coding-standards)
6. [Commit Message Guidelines](#commit-message-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Security Contributions](#security-contributions)
9. [Documentation Contributions](#documentation-contributions)
10. [Community](#community)
11. [Recognition](#recognition)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- **Git** (version 2.30 or higher)
- **Node.js** (version 20.x or higher, as specified in the workflow)
- **npm** (version 8.x or higher)
- A [GitHub account](https://github.com/join)

### First Steps

1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Phu-ai.git
   cd Phu-ai
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/phuquoc81/Phu-ai.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```

---

## How to Contribute

### Reporting Bugs

Before creating a bug report, please:
1. Search [existing issues](https://github.com/phuquoc81/Phu-ai/issues) to avoid duplicates
2. Check if the issue has already been fixed in a recent commit

When creating a bug report, use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Your environment details (OS, browser, Node.js version)

### Suggesting Features

Feature suggestions are welcome! Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:
- A clear description of the feature
- The problem it solves
- Examples of how it would work
- Any alternative solutions you've considered

### Reporting Security Vulnerabilities

**Do NOT report security vulnerabilities through public GitHub issues.**

See our [Security Policy](SECURITY.md) for responsible disclosure instructions.

### Contributing Code

1. Check the [issues list](https://github.com/phuquoc81/Phu-ai/issues) for something to work on
2. Issues labeled `good first issue` are great for newcomers
3. Comment on the issue to let others know you're working on it
4. Follow the development workflow below

---

## Development Setup

### Installing Dependencies

```bash
npm install
```

### Running the Application

```bash
npm start
```

### Running Tests

```bash
npm test
```

### Building the Application

```bash
npm run build
```

### Code Linting

```bash
npm run lint
```

### Environment Variables

Copy the example environment file and configure as needed:
```bash
cp .env.example .env
```

**Never commit `.env` files or secrets to the repository.**

---

## Coding Standards

### JavaScript / Node.js

- Follow the existing code style in the project
- Use ES6+ features where appropriate
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused on a single responsibility

### HTML / CSS

- Use semantic HTML5 elements
- Follow BEM naming convention for CSS classes
- Ensure responsive design for all screen sizes
- Meet WCAG 2.1 AA accessibility standards (see [ACCESSIBILITY.md](ACCESSIBILITY.md))

### Security Best Practices

- Never hardcode secrets, API keys, or credentials
- Validate and sanitize all user inputs
- Use parameterized queries for database operations
- Follow the [API Security Guidelines](API_SECURITY.md)
- Follow the [Authentication Policy](AUTHENTICATION_POLICY.md)

### Testing

- Write tests for new features and bug fixes
- Maintain or improve test coverage
- Tests should be deterministic and not depend on external services
- Mock external dependencies in unit tests

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                                    |
| ---------- | -------------------------------------------------------------- |
| `feat`     | A new feature                                                  |
| `fix`      | A bug fix                                                      |
| `docs`     | Documentation only changes                                     |
| `style`    | Changes that don't affect meaning (whitespace, formatting)     |
| `refactor` | Code change that neither fixes a bug nor adds a feature        |
| `test`     | Adding missing tests or correcting existing tests              |
| `chore`    | Changes to build process, tools, or dependencies               |
| `security` | Security-related changes or fixes                              |
| `perf`     | Performance improvements                                       |
| `ci`       | Changes to CI configuration files and scripts                  |

### Examples

```
feat(ai): add support for multi-language responses
fix(auth): resolve session timeout issue on mobile
docs(security): update vulnerability reporting process
security(headers): add missing CSP directives
```

### Breaking Changes

Indicate breaking changes in the footer:
```
feat(api): change authentication endpoint

BREAKING CHANGE: The /auth endpoint now requires Bearer token format
```

---

## Pull Request Process

### Before Submitting

- [ ] Fork the repository and create a feature branch from `main`
- [ ] Follow the coding standards outlined above
- [ ] Write or update tests for your changes
- [ ] Update documentation if necessary
- [ ] Ensure all tests pass locally
- [ ] Run the linter and fix any issues
- [ ] Check for security issues in your code

### Creating the Pull Request

1. **Push your branch** to your fork
2. **Open a Pull Request** against the `main` branch
3. **Fill out the PR template** completely
4. **Link related issues** using keywords (e.g., "Fixes #123")

### PR Description Requirements

Your PR description must include:
- **Summary**: What does this PR do?
- **Motivation**: Why is this change needed?
- **Changes**: List the key changes made
- **Testing**: How was this tested?
- **Screenshots** (for UI changes)
- **Breaking Changes** (if any)

### Review Process

1. Automated checks (CI, linting, tests) run first
2. A maintainer reviews the code
3. Address any requested changes
4. Once approved and all checks pass, the PR is merged

### Merge Strategy

We use **squash merging** to keep the main branch history clean.

---

## Security Contributions

If you're contributing security-related code changes (security headers, authentication, encryption, etc.):

1. Reference the relevant security policy document
2. Include security testing as part of your PR
3. Add or update security documentation if needed
4. Be especially careful about:
   - Input validation
   - Authentication and authorization
   - Cryptographic operations
   - Secrets handling

For security vulnerability reports, see [SECURITY.md](SECURITY.md).

---

## Documentation Contributions

Documentation improvements are always welcome! This includes:
- Fixing typos and grammar
- Improving clarity and readability
- Adding examples and use cases
- Translating documentation

### Documentation Files

Key documentation files are located in the repository root:
- `README.md` - Project overview
- `SECURITY.md` - Security policy
- `PRIVACY_POLICY.md` - Privacy policy
- `CONTRIBUTING.md` - This file
- And other policy/documentation files

---

## Community

- **GitHub Issues**: https://github.com/phuquoc81/Phu-ai/issues
- **GitHub Discussions**: https://github.com/phuquoc81/Phu-ai/discussions (if enabled)
- **Security Reports**: https://github.com/phuquoc81/Phu-ai/security/advisories

---

## Recognition

Contributors are recognized in the following ways:
- Listed in the commit history
- Mentioned in release notes for significant contributions
- Acknowledged in security advisories for responsible vulnerability disclosures

We appreciate every contribution, big or small!

---

## Version History

| Version | Date       | Changes                              |
| ------- | ---------- | ------------------------------------ |
| 1.0.0   | 2026-02-22 | Initial contributing guide created   |
