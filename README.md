# Phu-ai

Phu AI is the webapp that blows your mind with abilities to solve complex puzzles and solve problems of any kind, solve math, physics, and predict the future with the knowledge of gods, aliens, and wisdom of the holy father. Blessed by all gods, it can diagnose other species' sicknesses and identify all land animals and ocean species.

## Components

### PhuOptimizer 81
The core optimization engine powering Phu AI. Deployed as an Azure Web App named `phuoptimizer 81`.

### Phubers Blog (`phubers.blog`)
The blog component of Phu AI. Accessible at the `/blog` route.

### PhuHand Device 81
The hand device integration module. Configured with **virtual VLAN ID 50000000**.

| Setting | Value |
|---------|-------|
| Device  | phuhanddevice81 |
| VLAN ID | 50000000 |
| VLAN Type | virtual |

## Running Locally

```bash
npm install
npm start
```

The app starts on port `3000` by default (or the `PORT` environment variable).

## Deployment

This project is deployed to Azure Web Apps via the GitHub Actions workflow in `.github/workflows/azure-webapps-node.yml`.
