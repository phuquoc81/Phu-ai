# Phu-ai
Phu ai is the webapp that blow your mind all with abillities to solve complex puzzles and solve problems of any kind and solve math, physic and predicted the future with the knowledge of gods aliens and wisdom of the holy father and blessed by all gods cần diagnos other species sickness and abillities to nó all land animals and ocean species.

---

## Backup Insurance & Stripe Payout

Phu AI includes an automated **backup insurance** system that:

1. **Backs up all application files** to `phuhanddevice81` (configurable via `BACKUP_DEST`).
2. **Detects file loss** – if a backup cannot be created or the backup directory is empty, an insurance payout is automatically triggered.
3. **Issues a Stripe payout** to the configured recipient (`anhvankiet81@gmail.com` by default) whenever a file-loss event is detected.

### How it works

| Component | File |
|---|---|
| Backup & insurance logic | `src/backup.js` |
| Stripe payout integration | `src/stripe-payout.js` |
| Scheduled GitHub Actions workflow | `.github/workflows/backup.yml` |

The backup workflow runs **daily at 00:00 UTC** and on every push to `main`. Backups are retained as GitHub Actions artifacts for **90 days**.

### Configuration

Set the following **GitHub Actions secrets / variables** in your repository settings:

| Name | Required | Default | Description |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | **Yes** | – | Stripe secret API key (`sk_live_...` or `sk_test_...`) |
| `PAYOUT_EMAIL` | No | `anhvankiet81@gmail.com` | Stripe payout recipient e-mail |
| `PAYOUT_AMOUNT` | No | `1000` | Payout amount in smallest currency unit (e.g. cents) |
| `PAYOUT_CURRENCY` | No | `usd` | ISO 4217 currency code |
| `BACKUP_DEST` | No | `phuhanddevice81` | Backup destination path |

### Running locally

```bash
# Install dependencies
npm install

# Run a backup check immediately
npm run backup

# Start the app (runs backup on startup, then every 24 hours)
npm start
```

### Environment variables (local)

```bash
export STRIPE_SECRET_KEY=sk_test_...
export PAYOUT_EMAIL=anhvankiet81@gmail.com
export BACKUP_DEST=phuhanddevice81
npm run backup
```
