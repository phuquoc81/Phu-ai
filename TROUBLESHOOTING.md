# Troubleshooting

Common issues and how to fix them.

---

## 1. `Cannot connect to MongoDB`

**Symptoms:** Backend crashes with `MongoNetworkError` or `ECONNREFUSED`.

**Fixes:**
- **Docker Compose:** Ensure the `mongodb` service is healthy before the backend starts. It should be automatic via `depends_on.condition: service_healthy`. Run `docker compose ps` to check.
- **Local:** Make sure MongoDB is running: `sudo systemctl start mongod` (Linux) or open MongoDB Compass.
- **Atlas:** Verify your IP is whitelisted under **Network Access** and that the connection string in `MONGODB_URI` is correct.

---

## 2. `JWT malformed` / `invalid signature`

**Symptoms:** API returns `401 Unauthorized` even with a token.

**Fixes:**
- Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` in your `.env` match what was used to sign the token.
- After changing secrets, all existing tokens are invalidated — users must log in again.
- Confirm the `Authorization` header format: `Bearer <token>` (note the space).

---

## 3. Stripe webhook returns `400 Webhook Error: No signatures found`

**Symptoms:** Webhook endpoint rejects Stripe events.

**Fixes:**
- Make sure `STRIPE_WEBHOOK_SECRET` matches the signing secret shown in the Stripe dashboard for that endpoint.
- The backend must parse the request as **raw bytes** before verification. Do not apply `express.json()` to the `/api/webhook` route.
- For local testing, use the Stripe CLI: `stripe listen --forward-to localhost:5000/api/webhook`.

---

## 4. Frontend shows blank page / `REACT_APP_API_URL is not defined`

**Symptoms:** The React app loads but API calls fail or env vars are `undefined`.

**Fixes:**
- All `REACT_APP_*` variables must be set **at build time**, not runtime.
- Restart the dev server after changing `.env`.
- In production (Vercel), add the variables in **Settings → Environment Variables** and trigger a redeploy.

---

## 5. Docker Compose – `port is already allocated`

**Symptoms:** `Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use`

**Fix:**
```bash
# Find the process using the port
sudo lsof -i :80
# Kill it, then retry
docker compose up
```

---

## 6. Hardhat – `Error: cannot estimate gas`

**Symptoms:** Deployment script fails estimating gas on Mumbai or Polygon.

**Fixes:**
- Ensure your wallet has enough MATIC. Get test MATIC at [faucet.polygon.technology](https://faucet.polygon.technology/).
- Check your RPC URL is correct and reachable.
- Try setting an explicit `gasPrice` in `hardhat.config.js`:
  ```js
  mumbai: {
    gasPrice: 30_000_000_000, // 30 gwei
  }
  ```

---

## 7. `npm ci` fails in GitHub Actions (`package-lock.json` missing)

**Symptoms:** CI fails with `npm ci can only install packages when your package.json and package-lock.json are in sync`.

**Fix:** Commit `package-lock.json` for both `backend/` and `frontend/`. Never add `package-lock.json` to `.gitignore`.

---

## 8. Vercel deploy fails – `Build failed`

**Fix:**
1. Check Vercel build logs for the exact error.
2. Ensure `REACT_APP_*` environment variables are set in Vercel's dashboard.
3. Make sure `frontend/package.json` has a `"build"` script: `"react-scripts build"`.

---

## 9. Render backend sleeps / slow cold starts

**Symptoms:** First request after inactivity takes 30–60 seconds.

**Fix:** Upgrade to a paid Render plan (Starter+) to disable spin-down, or implement an uptime monitor (e.g. [UptimeRobot](https://uptimerobot.com/)) that pings `/api/health` every 5 minutes.

---

## 10. Smart contract verification fails on Polygonscan

**Symptoms:** `hardhat verify` returns `Already Verified` or `Bytecode does not match`.

**Fixes:**
- Make sure you are using the same Solidity version and optimizer settings that were used to compile before deploying.
- Wait 1–2 minutes after deployment for Polygonscan to index the transaction before running verify.
- Pass the constructor argument (`INITIAL_SUPPLY`) explicitly:
  ```bash
  npx hardhat verify --network mumbai <ADDRESS> "1000000000"
  ```

---

## Still Stuck?

Open a [GitHub Issue](https://github.com/phu-ai/Phu-ai/issues) and include:
- Error message and stack trace
- Steps to reproduce
- Your environment (OS, Node version, Docker version)
