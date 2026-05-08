# stripe3

stripe3 is a cross-chain x402 payment gateway for Solana APIs, AI tools, datasets, and paid digital resources.

The product idea is simple: a protected resource can respond with `402 Payment Required`, the user pays a Solana invoice, the Solana program stores a receipt PDA, and the backend unlocks access after verifying that receipt.

## Current Build Stage

This repo contains the frontend, local gateway, and Solana program foundation:

- Vite + React + Tailwind CSS v3
- fhex402-inspired black-grid interface
- Split component/page architecture
- Local checkout flow for `402 Payment Required`
- Anchor/Rust Solana program for product and receipt PDAs
- Wallet Standard support for Phantom, Solflare, and compatible Solana wallets
- LI.FI funding panel
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
POST /api/receipts
GET  /api/receipts
```

## Next Milestones

1. Deploy the Anchor program to devnet.
2. Initialize product PDAs with `npm run init:products`.
3. Verify receipt PDAs from the backend.
4. Add LI.FI Widget for production funding.
5. Deploy frontend, backend, and Solana program.

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
