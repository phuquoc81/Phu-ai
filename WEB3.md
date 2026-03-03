# Web3 & Smart Contract Guide

## Overview

Phu-ai integrates the **PHU81 ERC-20 token** deployed on the [Polygon](https://polygon.technology/) network. PHU81 is a utility token that can be used for platform rewards, governance, and premium feature access.

| Property | Value |
|---|---|
| Token Name | PHU81 Token |
| Symbol | PHU81 |
| Decimals | 18 |
| Initial Supply | 1,000,000,000 (1 billion) |
| Max Supply | 10,000,000,000 (10 billion) |
| Standard | ERC-20 (OpenZeppelin 5.x) |
| Network | Polygon Mainnet / Amoy Testnet |

---

## Contract Features

- **Mintable** – owner can mint up to the hard cap of 10 billion tokens
- **Burnable** – any token holder can burn their own tokens
- **Pausable** – owner can halt all transfers in an emergency
- **Ownable** – single owner with transfer-of-ownership support

---

## Local Development

### Prerequisites

- Node.js 20+
- An `.env` file (copy from `smart-contract/.env.example`)

### Setup

```bash
cd smart-contract
npm install
```

### Compile

```bash
npm run compile
# or: npx hardhat compile
```

Compiled artifacts appear in `smart-contract/artifacts/`.

### Run Tests

```bash
npm test
# or: npx hardhat test
```

### Local Deployment (Hardhat Network)

```bash
npx hardhat run scripts/deploy.js
```

---

## Testnet Deployment (Amoy)

1. Get test MATIC from the [Amoy Faucet](https://faucet.polygon.technology/).
2. Configure `smart-contract/.env`:
   ```
   AMOY_RPC_URL=https://rpc-amoy.polygon.technology
   PRIVATE_KEY=<your_wallet_private_key>
   POLYGONSCAN_API_KEY=<your_api_key>
   INITIAL_SUPPLY=1000000000
   ```
3. Deploy:
   ```bash
   npm run deploy:amoy
   ```
4. The contract address is saved to `smart-contract/deployment.json`.

---

## Mainnet Deployment (Polygon)

> ⚠️ Use a dedicated deployer wallet with only the MATIC needed for gas. Never commit your private key.

```bash
npm run deploy:polygon
```

Then verify on Polygonscan:

```bash
npx hardhat verify --network polygon <CONTRACT_ADDRESS> <INITIAL_SUPPLY>
```

---

## GitHub Actions Deployment

Use the **Deploy Smart Contract** workflow (`deploy-contract.yml`):

1. Go to **Actions → Deploy Smart Contract → Run workflow**.
2. Choose the target network (`amoy` or `polygon`).
3. The workflow compiles, tests, deploys, and attempts Polygonscan verification automatically.

Required GitHub Secrets:

| Secret | Description |
|---|---|
| `DEPLOYER_PRIVATE_KEY` | Wallet private key for deployment |
| `AMOY_RPC_URL` | Polygon Amoy testnet RPC endpoint |
| `POLYGON_RPC_URL` | Polygon mainnet RPC endpoint |
| `POLYGONSCAN_API_KEY` | For contract verification |

---

## Interacting with the Contract

### Using ethers.js (frontend)

```javascript
import { ethers } from "ethers";
import PHU81ABI from "./artifacts/contracts/PHU81.sol/PHU81.json";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(
  process.env.REACT_APP_WEB3_CONTRACT_ADDRESS,
  PHU81ABI.abi,
  signer
);

// Read balance
const balance = await contract.balanceOf(await signer.getAddress());
console.log(ethers.formatEther(balance), "PHU81");

// Transfer
await contract.transfer("0xRecipient...", ethers.parseEther("100"));
```

### Using Hardhat console

```bash
npx hardhat console --network amoy
> const PHU81 = await ethers.getContractAt("PHU81", "<address>")
> await PHU81.totalSupply()
```

---

## Security Considerations

- The contract owner key should be transferred to a **multisig wallet** (e.g. Gnosis Safe) after initial deployment.
- The `pause()` function is an emergency circuit-breaker — monitor for anomalous activity.
- Minting is capped at 10 billion tokens; no further supply beyond the cap is possible.
