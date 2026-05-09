# stripe3

stripe3 is an x402 payment gateway for Solana-paid APIs, AI tools, datasets, files, and other protected digital resources.

It gives resource owners a simple flow: publish a paid endpoint, return `402 Payment Required` until payment is made, settle the payment through a Solana program, then unlock the resource after the gateway verifies the on-chain receipt.

## Status

The devnet payment flow is functional end to end:

- Sellers can create paid resources from a Solana wallet.
- The Anchor program creates Product PDAs and Receipt PDAs.
- Buyers receive x402 payment terms before access is granted.
- Buyers pay with devnet SOL and unlock protected content.
- Receipts can be fetched from Solana and displayed in the app.
- Sellers can take listings down globally by deactivating the on-chain product.
- LI.FI is integrated as the production funding path for users who need to bridge or swap into Solana before paying.

Mainnet support is wired in the app and gateway. Mainnet program deployment is a final launch step because it requires real SOL for rent-exempt program storage.

## Why It Matters

Paid APIs and digital resources usually depend on accounts, dashboards, card processors, API keys, or private billing records. stripe3 moves the access decision closer to an open web primitive:

```text
HTTP request -> 402 Payment Required -> Solana receipt -> protected response
```

The receipt is not just a database row. It is a Solana PDA that can be verified by the gateway and reused by the buyer wallet.

## Core Features

- `x402`-style payment challenge using `PAYMENT-REQUIRED`, `PAYMENT-SIGNATURE`, and `PAYMENT-RESPONSE` headers.
- Anchor/Rust Solana program for Product and Receipt accounts.
- Seller resource creation with protected content metadata stored by the gateway.
- Buyer checkout with Solana wallet signing.
- Receipt verification before protected content is served.
- Seller take-down flow that deactivates the Product PDA and removes the listing.
- LI.FI Widget integration for production cross-chain Solana funding.
- Devnet and production network modes with separate RPC/program configuration.

## Workflow

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                              SELLER PUBLISH FLOW                            │
└──────────────────────────────────────────────────────────────────────────────┘

┌────────────────────┐
│   Seller Wallet    │
│ Phantom/Solflare   │
└─────────┬──────────┘
          │
          │  1. Enter resource name, price, type, and protected content
          │
          v
┌────────────────────┐
│  stripe3 Frontend  │
│  Resource Form     │
└─────────┬──────────┘
          │
          │  2. createProduct(resource_id, price)
          │
          v
┌────────────────────┐
│  Solana Program    │
│  Product PDA       │
└─────────┬──────────┘
          │
          │  3. Product is stored on-chain with merchant, price, active flag
          │
          v
┌────────────────────┐
│  x402 Gateway      │
│  Resource Catalog  │
└─────────┬──────────┘
          │
          │  4. Metadata and protected payload are saved
          │
          v
┌────────────────────┐
│  Live Resource     │
│  Ready for buyers  │
└────────────────────┘
```

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                              BUYER ACCESS FLOW                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌────────────────────┐
│  Buyer or Agent    │
│  Wants access      │
└─────────┬──────────┘
          │
          │  1. GET /api/protected/:resourceId
          │
          v
┌────────────────────┐
│  x402 Gateway      │
│  Protected Route   │
└─────────┬──────────┘
          │
          │  2. Returns 402 Payment Required
          │     terms: amount, merchant, network, program, Product PDA
          │
          v
┌────────────────────┐
│  Buyer Wallet      │
│  Signs payment     │
└─────────┬──────────┘
          │
          │  3. Sends Solana payment transaction
          │
          v
┌────────────────────┐
│  Solana Program    │
│  Payment + Receipt │
└─────────┬──────────┘
          │
          │  4. Transfers SOL to merchant
          │  5. Creates Receipt PDA for buyer + product
          │
          v
┌────────────────────┐
│  x402 Gateway      │
│  Receipt Verifier  │
└─────────┬──────────┘
          │
          │  6. Verifies Receipt PDA on Solana
          │
          v
┌────────────────────┐
│ Protected Content  │
│  Returned to buyer │
└────────────────────┘
```

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION FUNDING PATH                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌────────────────────┐
│ Buyer lacks funds  │
│ on Solana mainnet  │
└─────────┬──────────┘
          │
          │  1. Open embedded LI.FI widget
          │
          v
┌────────────────────┐
│      LI.FI         │
│ Bridge / Swap UX   │
└─────────┬──────────┘
          │
          │  2. Route liquidity from a supported chain into Solana
          │
          v
┌────────────────────┐
│ Funded Solana      │
│ Wallet             │
└─────────┬──────────┘
          │
          │  3. Buyer returns to stripe3 checkout
          │
          v
┌────────────────────┐
│ x402 Payment Flow  │
│ Continues normally │
└────────────────────┘
```

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                              SELLER TAKE-DOWN                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌────────────────────┐
│ Seller Wallet      │
│ Owns the resource  │
└─────────┬──────────┘
          │
          │  1. Confirms take-down in the app
          │
          v
┌────────────────────┐
│ Solana Program     │
│ setProductActive   │
└─────────┬──────────┘
          │
          │  2. Product PDA active flag becomes false
          │
          v
┌────────────────────┐
│ x402 Gateway       │
│ Shared Catalog     │
└─────────┬──────────┘
          │
          │  3. Listing is removed after on-chain inactive state is verified
          │
          v
┌────────────────────┐
│ Resource Hidden    │
│ No new purchases   │
└────────────────────┘
```

## Architecture

```text
React frontend
  - Resource marketplace
  - Seller creation form
  - Buyer payment modal
  - Activity trace
  - Receipt viewer
  - LI.FI funding surface

x402 gateway
  - Supabase-backed resource catalog
  - Protected resource routes
  - Payment-required responses
  - Receipt verification
  - Seller take-down endpoint

Solana program
  - Product PDA
  - Receipt PDA
  - Payment settlement
  - Product active flag
```

## Project Structure

```text
.
├── Anchor.toml
├── Cargo.toml
├── programs
│   └── stripe3
│       ├── Cargo.toml
│       └── src
│           └── lib.rs
├── public
│   └── favicon.svg
├── scripts
│   └── init-products.mjs
├── server
│   └── index.js
├── supabase
│   └── stripe3_resources.sql
├── src
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── components
│   │   ├── agent
│   │   │   ├── AgentConsole.jsx
│   │   │   └── AgentLog.jsx
│   │   ├── checkout
│   │   │   ├── PaymentModal.jsx
│   │   │   └── UnlockedContentModal.jsx
│   │   ├── layout
│   │   │   ├── CookieConsent.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── TopBar.jsx
│   │   ├── resources
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── ResourceForm.jsx
│   │   │   └── TakeDownResourceModal.jsx
│   │   ├── solana
│   │   │   └── SolanaProvider.jsx
│   │   └── ui
│   │       ├── EmptyNotice.jsx
│   │       ├── Logo.jsx
│   │       └── index.jsx
│   ├── idl
│   │   └── stripe3.json
│   ├── lib
│   │   ├── data.js
│   │   ├── gatewayClient.js
│   │   ├── networks.js
│   │   ├── stripe3Program.js
│   │   ├── utils.js
│   │   └── x402.js
│   └── pages
│       ├── AgentMode.jsx
│       ├── Landing.jsx
│       ├── Receipts.jsx
│       └── Resources.jsx
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Solana Program

The Solana program is written in Rust with Anchor.

### Product PDA

Stores:

- Merchant wallet
- Product ID
- Price in lamports
- Active flag
- PDA bump

### Receipt PDA

Stores:

- Product account
- Buyer wallet
- Merchant wallet
- Amount paid
- Timestamp
- PDA bump

## Gateway API

```text
GET    /health
GET    /api/resources
POST   /api/resources
DELETE /api/resources/:resourceId
POST   /api/invoices
GET    /api/protected/:resourceId
GET    /api/receipts
```

Protected routes return `402 Payment Required` until the gateway can verify a valid receipt PDA for the buyer wallet.

## Persistent Storage

stripe3 keeps payment truth on Solana and catalog data in Supabase:

- Product PDA: merchant, product ID, price, and active status.
- Receipt PDA: buyer access proof after payment.
- Supabase database: resource title, description, endpoint, and protected text.
- Supabase Storage: optional protected files such as images, PDFs, CSVs, JSON, archives, tools, articles, or datasets.

Create the Supabase table by running this file in the Supabase SQL editor:

```text
supabase/stripe3_resources.sql
```

Set these only on the backend service:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_RESOURCES_TABLE
SUPABASE_RESOURCE_BUCKET
SUPABASE_SIGNED_URL_TTL_SECONDS
```

Do not expose the service role key in Vercel or any frontend environment. `STRIPE3_DATA_DIR` is only a local fallback when Supabase is not configured.
Uploaded files stay in a private bucket and are served through short-lived signed URLs after receipt verification.

## Network Modes

```text
Devnet
  Purpose: demo and judging flow
  Settlement: devnet SOL
  Program: deployed on Solana devnet

Production
  Purpose: real launch path
  Settlement: Solana mainnet
  Funding: LI.FI bridge/swap routes into Solana
  Program: configured in code, mainnet deployment pending final launch funding
```

## Local Development

Install dependencies:

```bash
npm install
```

Create local env:

```bash
cp .env.example .env
```

Run the gateway:

```bash
npm run dev:gateway
```

Run the frontend:

```bash
npm run dev
```

## Environment Variables

```text
VITE_GATEWAY_URL
VITE_SOLANA_DEVNET_RPC_URL
VITE_SOLANA_MAINNET_RPC_URL
VITE_STRIPE3_DEVNET_PROGRAM_ID
VITE_STRIPE3_MAINNET_PROGRAM_ID
PORT
SOLANA_DEVNET_RPC_URL
SOLANA_MAINNET_RPC_URL
STRIPE3_DEVNET_PROGRAM_ID
STRIPE3_MAINNET_PROGRAM_ID
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_RESOURCES_TABLE
SUPABASE_RESOURCE_BUCKET
SUPABASE_SIGNED_URL_TTL_SECONDS
STRIPE3_MAX_UPLOAD_BYTES
STRIPE3_MAX_REQUEST_BYTES
STRIPE3_DATA_DIR
```

Use `.env.example` as a template. Do not commit a filled `.env`.

## Deployment

### Devnet

```bash
cd /mnt/c/Users/Victor/Desktop/stripe3

anchor build
anchor deploy --provider.cluster devnet
```

### Mainnet Launch Step

The program keypair resolves to the same public address used on devnet:

```text
9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW
```

Mainnet deployment is intentionally left as a final launch step because Solana mainnet program deployment requires real SOL for rent-exempt program storage.

When ready:

```bash
cd to "your path"

RPC_URL="<YOUR_MAINNET_RPC_URL>"
PROGRAM_ID="9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW"

anchor build

solana program deploy target/deploy/stripe3.so \
  --program-id target/deploy/stripe3-keypair.json \
  --url "$RPC_URL" \
  --keypair ~/.config/solana/id.json \
  --use-rpc \
  --max-sign-attempts 100

solana program show "$PROGRAM_ID" -u "$RPC_URL"
```

## Deployment Addresses

### Solana Devnet

```text
Program ID: 9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW
Explorer: https://explorer.solana.com/address/9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW?cluster=devnet
```

### Solana Mainnet

```text
Status: final launch step
Reserved program ID: 9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW
```

## Demo Flow

1. Start the gateway and frontend.
2. Connect a seller wallet.
3. Create a paid resource.
4. Connect a buyer wallet with devnet SOL.
5. Purchase the resource.
6. Confirm the Solana transaction.
7. Watch the x402 activity trace.
8. Copy the unlocked protected content.
9. Open receipts to verify the on-chain access proof.
10. Switch to production mode to show LI.FI funding for the mainnet launch path.

## Notes:

The core payment and receipt system is functional on Solana devnet. Production mode is implemented as the mainnet-ready path, including LI.FI funding, while the actual mainnet program deployment is reserved for launch funding because it requires real SOL.
