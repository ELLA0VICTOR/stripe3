export const defaultMerchant = "7TFtVd1e5DSaonVSGP73GPKe78w2EmkL5LrkjGGL6PDH";

export const navItems = [
  { id: "resources", label: "Resources", glyph: "01" },
  { id: "agent", label: "Activity", glyph: "02" },
  { id: "receipts", label: "Receipts", glyph: "03" },
];

export const networkModes = {
  sandbox: {
    label: "Sandbox",
    network: "Solana devnet",
    asset: "SOL",
    lifi: "Mainnet only",
    description: "Test invoices and receipts with devnet SOL.",
  },
  production: {
    label: "Production",
    network: "Solana mainnet",
    asset: "SOL / USDC",
    lifi: "LI.FI widget active",
    description: "Bridge or swap into Solana, then complete payment.",
  },
};

export const resources = [
  {
    id: "premium-signal",
    title: "Premium Solana Signal API",
    type: "API",
    priceLamports: 3_000_000,
    merchant: defaultMerchant,
    status: "Live",
    endpoint: "/api/protected/premium-signal",
    description: "A paid market-signal endpoint unlocked through x402 and verified by Solana receipts.",
  },
  {
    id: "agent-toolkit",
    title: "Agent Route Optimizer",
    type: "AI tool",
    priceLamports: 5_000_000,
    merchant: defaultMerchant,
    status: "Draft",
    endpoint: "/api/protected/agent-toolkit",
    description: "A premium AI tool that prepares route intelligence after payment verification.",
  },
  {
    id: "dataset-drop",
    title: "Liquidity Dataset Drop",
    type: "Dataset",
    priceLamports: 8_000_000,
    merchant: defaultMerchant,
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
    copy: "Use LI.FI to bridge or swap into Solana before paying.",
  },
];
