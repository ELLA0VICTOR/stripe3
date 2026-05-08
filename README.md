# stripe3

stripe3 is a cross-chain x402 payment gateway for Solana APIs, AI tools, datasets, and paid digital resources.

The product idea is simple: a protected resource can respond with `402 Payment Required`, the user pays a Solana invoice, the Solana program stores a receipt PDA, and the backend unlocks access after verifying that receipt.

## Current Build Stage

This repo contains the frontend, x402 gateway, LI.FI funding surface, and Solana program:

- Vite + React + Tailwind CSS v3
- fhex402-inspired black-grid interface
- Split component/page architecture
- x402 V2-style `PAYMENT-REQUIRED`, `PAYMENT-SIGNATURE`, and `PAYMENT-RESPONSE` headers
- Anchor/Rust Solana program for product and receipt PDAs
- Wallet Standard support for Phantom, Solflare, and compatible Solana wallets
- Embedded LI.FI Widget funding flow for production onboarding
- Agent payment console

## Target Architecture

```text
frontend/
  Vite + React + Tailwind UI

backend/
  x402 gateway server
  protected resource routes
  Solana receipt verifier

programs/stripe3/
  Anchor/Rust Solana program
  merchant, product, invoice, receipt PDAs
```

## Hackathon Modes

```text
Sandbox Mode
Network: Solana devnet
Payment: devnet SOL
Purpose: safe testing

Production Mode
Network: Solana mainnet
Payment: SOL / USDC
LI.FI: mainnet cross-chain funding into Solana
Purpose: real-world checkout path
```

## Local Development

```bash
npm install
npm run dev
npm run dev:gateway
```

## Solana Program

```bash
# WSL
cd /mnt/c/Users/Victor/Desktop/stripe3
anchor build
anchor deploy --provider.cluster devnet

export ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"
export ANCHOR_WALLET="$HOME/.config/solana/id.json"
npm run init:products
```

The program stores:

```text
Product PDA: product definition, merchant, price, active flag
Receipt PDA: buyer, merchant, product, amount, timestamp
```

The local gateway runs on `http://localhost:4100` and exposes:

```text
GET  /api/resources
POST /api/invoices
GET  /api/protected/:resourceId
GET  /api/receipts
```

## Next Milestones

1. Deploy frontend and gateway services.
2. Add production environment variables for `VITE_GATEWAY_URL`, `VITE_SOLANA_RPC_URL`, and `SOLANA_RPC_URL`.
3. Record a sub-3-minute demo video showing wallet payment, x402 unlock, receipt lookup, and LI.FI funding.
4. Optional: add code splitting for the LI.FI widget bundle before final production launch.

## Deployment Addresses

Generated devnet program ID:

```text
Program ID: 9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW
Cluster: Devnet
Explorer: https://explorer.solana.com/address/9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW?cluster=devnet
```

Initialized devnet product PDAs:

```text
premium-signal: 7s547sgqaNhN4z737DfspcaapRtxCKiYHYc5DF3bkTyi
agent-toolkit: GNGxK9Aomgb9Hm2MCBpfYsxt8SQfyXgckAaQgNq3o1Dg
dataset-drop: 3XX2PAXVRFkSHSB6LbdDk9KTMeN4NsqNMrsLr7TRSQh5
```
