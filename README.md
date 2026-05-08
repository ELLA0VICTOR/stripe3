# stripe3

stripe3 is a cross-chain x402 payment gateway for Solana APIs, AI tools, datasets, and paid digital resources.

The product idea is simple: a protected resource can respond with `402 Payment Required`, the user pays a Solana invoice, the Solana program stores a receipt PDA, and the backend unlocks access after verifying that receipt.

## Current Build Stage

This repo currently contains the frontend product foundation:

- Vite + React + Tailwind CSS v3
- fhex402-inspired black-grid interface
- Split component/page architecture
- Local checkout flow for `402 Payment Required`
- Solana receipt PDA interface
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

The local gateway runs on `http://localhost:4100` and exposes:

```text
GET  /api/resources
POST /api/invoices
GET  /api/protected/:resourceId
POST /api/receipts
GET  /api/receipts
```

## Next Milestones

1. Add the x402 backend gateway.
2. Add the Anchor program for invoices and receipts.
3. Wire wallet connect and devnet SOL payment.
4. Verify receipt PDAs from the backend.
5. Add LI.FI Widget for production funding.
6. Deploy frontend, backend, and Solana program.

## Deployment Addresses

To be added after Solana devnet deployment:

```text
Program ID:
Cluster:
Explorer:
```
