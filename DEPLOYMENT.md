# Deployment Guide

This guide covers deploying Phu-ai to production using Vercel (frontend), Render (backend), and MongoDB Atlas.

---

## 1. MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a database user with a strong password (**Database Access → Add New User**).
3. Whitelist `0.0.0.0/0` or your server IPs (**Network Access → Add IP Address**).
4. Copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/phuai?retryWrites=true&w=majority
   ```
5. Set this as `MONGODB_URI` in your environment.

---

## 2. Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**.
2. Connect your GitHub repository and select the `backend/` root directory.
3. Set:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all environment variables from `.env.example` (backend section) under **Environment**.
5. Copy the **Deploy Hook URL** and store it as `RENDER_DEPLOY_HOOK_URL` in GitHub Secrets.
6. After first deploy, note the public URL (e.g. `https://phuai-backend.onrender.com`).

### Health Check

```bash
curl https://phuai-backend.onrender.com/api/health
# Expected: {"status":"ok","uptime":...}
```

---

## 3. Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variables under **Settings → Environment Variables**:
   ```
   REACT_APP_API_URL=https://phuai-backend.onrender.com/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   REACT_APP_WEB3_CONTRACT_ADDRESS=0x...
   ```
4. Copy your **Vercel Token** from [vercel.com/account/tokens](https://vercel.com/account/tokens) and store it as `VERCEL_TOKEN` in GitHub Secrets.
5. Deploy – Vercel will assign a `*.vercel.app` domain automatically.

---

## 4. SSL / HTTPS

- **Vercel** and **Render** both provision TLS certificates automatically.
- For Docker/self-hosted deployments, place certificates in `nginx/certs/` and update `nginx/nginx.conf`:
  ```nginx
  listen 443 ssl;
  ssl_certificate     /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;
  ```
  Use [Certbot](https://certbot.eff.org/) or [Let's Encrypt](https://letsencrypt.org/) to obtain free certificates.

---

## 5. Stripe Configuration

1. Log in to [dashboard.stripe.com](https://dashboard.stripe.com).
2. Under **Developers → API Keys**, copy **Secret key** → `STRIPE_SECRET_KEY`.
3. Under **Developers → Webhooks → Add endpoint**:
   - URL: `https://phuai-backend.onrender.com/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`.

---

## 6. Environment Variables Checklist

### Backend (Render)

| Variable | Required | Notes |
|---|---|---|
| `NODE_ENV` | ✅ | Set to `production` |
| `PORT` | ✅ | `5000` (or Render's `$PORT`) |
| `MONGODB_URI` | ✅ | Atlas connection string |
| `JWT_SECRET` | ✅ | Min 32 random characters |
| `JWT_EXPIRY` | ✅ | e.g. `15m` |
| `JWT_REFRESH_SECRET` | ✅ | Min 32 random characters |
| `STRIPE_SECRET_KEY` | ✅ | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | ✅ | `whsec_...` |
| `FRONTEND_URL` | ✅ | Your Vercel URL |

### Frontend (Vercel)

| Variable | Required | Notes |
|---|---|---|
| `REACT_APP_API_URL` | ✅ | Backend Render URL + `/api` |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | ✅ | `pk_live_...` |
| `REACT_APP_WEB3_CONTRACT_ADDRESS` | ⬜ | PHU81 contract address |

### GitHub Secrets

| Secret | Used by |
|---|---|
| `VERCEL_TOKEN` | `deploy.yml` |
| `RENDER_DEPLOY_HOOK_URL` | `deploy.yml` |
| `DEPLOYER_PRIVATE_KEY` | `deploy-contract.yml` |
| `POLYGONSCAN_API_KEY` | `deploy-contract.yml` |
| `AMOY_RPC_URL` | `deploy-contract.yml` |
| `POLYGON_RPC_URL` | `deploy-contract.yml` |

---

## 7. Health Check Verification

After deployment run:

```bash
# Backend health
curl https://<your-backend-url>/api/health

# Frontend – opens in browser
open https://<your-vercel-url>
```

Both should return `200 OK`.
