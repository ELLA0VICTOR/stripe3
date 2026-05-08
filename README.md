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
- Seller flow for creating paid resources on-chain
- File-backed gateway resource catalog for demo deployment

## Project Structure

```text
src/
  React pages, wallet checkout, x402 client, Solana client
server/
  x402 gateway, protected resource routes, receipt verifier
programs/stripe3/
  Anchor/Rust Solana program
scripts/
  Product initialization helpers
```

## Flow

1. A seller connects a Solana wallet and creates a paid resource.
2. The frontend creates a Product PDA with the Anchor program.
3. The gateway stores the resource metadata and protected content.
4. A buyer opens the resource and receives a `402 Payment Required` response.
5. The buyer pays on Solana, creating a Receipt PDA.
6. The gateway verifies the receipt and returns the protected payload.
7. If the buyer needs Solana funds, production mode exposes LI.FI funding.

## Hackathon Modes

```text
Devnet Mode
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
cp .env.example .env
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
```

The program stores:

```text
Product PDA: product definition, merchant, price, active flag
Receipt PDA: buyer, merchant, product, amount, timestamp
```

The local gateway runs on `http://localhost:4100` and exposes:

```text
GET  /api/resources
POST /api/resources
POST /api/invoices
GET  /api/protected/:resourceId
GET  /api/receipts
```

## Demo Checklist

1. Start the gateway and frontend.
2. Connect a seller wallet and create a paid resource.
3. Connect a buyer wallet with devnet SOL.
4. Purchase the resource and confirm the Solana transaction.
5. Watch the activity screen show the x402 unlock result.
6. Open the receipts screen to verify the on-chain receipt.
7. Switch to production mode to show the LI.FI funding path.

For deployment, set:

```text
VITE_GATEWAY_URL
VITE_SOLANA_RPC_URL
PORT
SOLANA_RPC_URL
STRIPE3_DATA_DIR
```

On Render, attach a small persistent disk for the gateway and point `STRIPE3_DATA_DIR` to that mounted folder so seller-created resource metadata survives restarts.

## Deployment Addresses

Generated devnet program ID:

```text
Program ID: 9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW
Cluster: Devnet
Explorer: https://explorer.solana.com/address/9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW?cluster=devnet
```

Initialized devnet product PDAs:

```text
Products are created by sellers from the Resources page.
```
