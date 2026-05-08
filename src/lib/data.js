export const demoWallet = "8Rail3aX402SolanaDevnetWallet111111111111111";

export const navItems = [
  { id: "resources", label: "Resources", glyph: "01" },
  { id: "checkout", label: "Checkout", glyph: "02" },
  { id: "agent", label: "Agent", glyph: "03" },
  { id: "receipts", label: "Receipts", glyph: "04" },
  { id: "developers", label: "Developers", glyph: "05" },
];

export const networkModes = {
  sandbox: {
    label: "Sandbox",
    network: "Solana devnet",
    asset: "SOL",
    lifi: "Production preview",
    description: "Safe x402 invoice testing with devnet SOL and onchain receipt PDAs.",
  },
  production: {
    label: "Production",
    network: "Solana mainnet",
    asset: "SOL / USDC",
    lifi: "LI.FI widget active",
    description: "Mainnet checkout path where users can fund Solana from other chains.",
  },
};

export const resources = [
  {
    id: "premium-signal",
    title: "Premium Solana Signal API",
    type: "API",
    priceLamports: 3_000_000,
    merchant: "7Payx4029xYt4JgWzM2vD6jQnP8hR9sLk2",
    status: "Live",
    endpoint: "/api/protected/premium-signal",
    description: "A paid market-signal endpoint unlocked through x402 and verified by Solana receipts.",
  },
  {
    id: "agent-toolkit",
    title: "Agent Route Optimizer",
    type: "AI tool",
    priceLamports: 5_000_000,
    merchant: "6Toolx4029vR3qQLmP4fXg2wZk18nPp2",
    status: "Draft",
    endpoint: "/api/protected/agent-toolkit",
    description: "A premium AI tool that prepares route intelligence after payment verification.",
  },
  {
    id: "dataset-drop",
    title: "Liquidity Dataset Drop",
    type: "Dataset",
    priceLamports: 8_000_000,
    merchant: "4Datax4028uYp3aVN8mH2qP7sQf9cRr1",
    status: "Live",
    endpoint: "/api/protected/dataset-drop",
    description: "A downloadable dataset with access gated by a paid Solana receipt.",
  },
];

export const stats = [
  { value: "402", label: "Native web signal", sub: "Payment required before access" },
  { value: "SOL", label: "Settlement rail", sub: "Invoices and receipts on Solana" },
  { value: "LI.FI", label: "Funding path", sub: "Mainnet routes into Solana" },
  { value: "AI", label: "Agent-ready", sub: "Machines can pay and retry" },
];

export const landingFeatures = [
  {
    title: "Sell any resource",
    copy: "Wrap APIs, AI tools, datasets, downloads, and private links in one x402 payment flow.",
  },
  {
    title: "Verify with Solana",
    copy: "Payments create receipt PDAs so access can be checked without trusting a private database.",
  },
  {
    title: "Fund from any chain",
    copy: "Production Mode adds LI.FI so users can bridge or swap into Solana before paying.",
  },
];

export const receipts = [
  {
    id: "rcpt_001",
    resource: "Premium Solana Signal API",
    buyer: "9Buyerx402Fi31m8sXv2n6BqPp4",
    amount: "0.0030 SOL",
    status: "Verified",
    pda: "Hn2stripe3Receipt9FcWQ38zY4Ks6m22Qa2",
    timestamp: "2 min ago",
  },
  {
    id: "rcpt_002",
    resource: "Liquidity Dataset Drop",
    buyer: "3Agentx402Pay9vLr8mT51QpS0",
    amount: "0.0080 SOL",
    status: "Verified",
    pda: "8qAstripe3Receipt5KmY19sV7wLc20z",
    timestamp: "8 min ago",
  },
];

export const agentSteps = [
  {
    label: "Request",
    detail: "Agent calls GET /api/protected/premium-signal.",
    status: "done",
  },
  {
    label: "402",
    detail: "Gateway returns Payment Required with Solana invoice terms.",
    status: "done",
  },
  {
    label: "Pay",
    detail: "Agent prepares a devnet SOL payment to the Stripe3 invoice.",
    status: "active",
  },
  {
    label: "Retry",
    detail: "Agent retries with payment proof and receives the premium payload.",
    status: "queued",
  },
];

export const integrationSnippet = `import { stripe3 } from "@stripe3/gateway";

app.get("/premium-api", stripe3.protect({
  productId: "premium-signal",
  network: "solana-devnet",
}), async (req, res) => {
  res.json({ signal: "Unlocked after Solana receipt verification" });
});`;
