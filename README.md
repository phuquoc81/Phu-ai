# Phu-ai

![CI](https://github.com/phu-ai/Phu-ai/actions/workflows/test.yml/badge.svg)
![Security](https://github.com/phu-ai/Phu-ai/actions/workflows/security.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

**Phu-ai** is an enterprise SaaS platform powered by advanced AI. It helps teams solve complex problems across mathematics, physics, biology, and more — delivered as a subscription service with Web3 token integration.

---

## ✨ Features

- 🤖 **AI Query Engine** — Natural language queries answered by a powerful AI backend
- 💳 **Stripe Billing** — Subscription tiers with customer portal and webhook processing
- 👥 **Team Management** — Invite teammates and manage roles
- 📊 **Usage Analytics** — Per-user and per-team usage dashboards
- 🔐 **JWT Authentication** — Secure access with refresh-token rotation
- 🪙 **PHU81 Token (Web3)** — ERC-20 utility token on Polygon for platform rewards
- 🛡️ **Admin Dashboard** — Revenue metrics and user management

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS |
| Backend | Node.js, Express, MongoDB |
| Auth | JWT (access + refresh tokens) |
| Payments | Stripe Subscriptions |
| Smart Contract | Solidity 0.8.20, OpenZeppelin 5, Hardhat |
| Blockchain | Polygon (MATIC) |
| DevOps | Docker, Nginx, GitHub Actions |
| Hosting | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## 🚀 Quick Start

### Option 1 – Docker Compose (recommended)

```bash
# 1. Clone the repo
git clone https://github.com/phu-ai/Phu-ai.git
cd Phu-ai

# 2. Copy and fill in environment variables
cp .env.example .env
# Edit .env with your real values

# 3. Start all services
docker compose up --build
```

The app will be available at **http://localhost**.

### Option 2 – Manual (local development)

**Prerequisites:** Node.js 20+, MongoDB 7+

```bash
# Backend
cd backend
cp .env.example .env   # fill in values
npm install
npm run dev            # starts on :5000

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm start              # starts on :3000
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and set the values listed there.  
See [DEPLOYMENT.md](./DEPLOYMENT.md) for a full production checklist.

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `STRIPE_SECRET_KEY` | Stripe secret key (backend) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `REACT_APP_API_URL` | Backend API base URL (frontend) |

---

## 📚 Documentation

| Document | Description |
|---|---|
| [API.md](./API.md) | Full REST API reference |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| [WEB3.md](./WEB3.md) | PHU81 token & smart contract guide |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |
| [SECURITY.md](./SECURITY.md) | Security policy & vulnerability reporting |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues & fixes |

---

## 📄 License

[MIT](./LICENSE)

