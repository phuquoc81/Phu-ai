# Contributing to Phu-ai

Thank you for your interest in contributing! Please read this guide before submitting a pull request.

---

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/Phu-ai.git
   cd Phu-ai
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. Follow the [Quick Start](./README.md#-quick-start) to run the project locally.

---

## Branch Naming

| Prefix | Purpose |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code refactor (no feature/fix) |
| `test/` | Adding or updating tests |
| `chore/` | Build, CI, dependency updates |

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add refresh token rotation
fix(billing): handle webhook signature mismatch
docs(api): document /api/usage endpoint
```

---

## Pull Request Checklist

Before opening a PR, confirm:

- [ ] All existing tests pass (`npm test`)
- [ ] New code is covered by tests
- [ ] No secrets or credentials in code
- [ ] Linter passes (`npm run lint`)
- [ ] Documentation updated if behaviour changed
- [ ] PR description explains **what** and **why**

---

## Development Workflow

### Backend

```bash
cd backend
npm install
npm run dev      # nodemon watch mode
npm test         # jest
npm run lint     # eslint
```

### Frontend

```bash
cd frontend
npm install
npm start        # CRA dev server
npm test         # react-scripts test
npm run lint
```

### Smart Contract

```bash
cd smart-contract
npm install
npx hardhat compile
npx hardhat test
```

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/phu-ai/Phu-ai/issues) with:

- Steps to reproduce
- Expected vs actual behaviour
- Environment (OS, Node version, browser)
- Relevant logs or screenshots

---

## Security Issues

**Do not** open a public issue for security vulnerabilities. See [SECURITY.md](./SECURITY.md).
