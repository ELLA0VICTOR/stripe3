import { clusterApiUrl, Connection } from "@solana/web3.js";
import idl from "../idl/stripe3.json";

const devnetProgramId = import.meta.env.VITE_STRIPE3_DEVNET_PROGRAM_ID || idl.address;
const mainnetProgramId = import.meta.env.VITE_STRIPE3_MAINNET_PROGRAM_ID || "";

export const stripe3Networks = {
  devnet: {
    mode: "devnet",
    label: "Devnet",
    network: "solana-devnet",
    displayName: "Solana devnet",
    cluster: "devnet",
    rpcUrl: import.meta.env.VITE_SOLANA_DEVNET_RPC_URL || import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl("devnet"),
    programId: devnetProgramId,
  },
  production: {
    mode: "production",
    label: "Production",
    network: "solana-mainnet",
    displayName: "Solana mainnet",
    cluster: "mainnet-beta",
    rpcUrl: import.meta.env.VITE_SOLANA_MAINNET_RPC_URL || clusterApiUrl("mainnet-beta"),
    programId: mainnetProgramId,
  },
};

export function getStripe3Network(mode = "devnet") {
  return stripe3Networks[mode] || stripe3Networks.devnet;
}

export function getModeFromNetwork(network = "solana-devnet") {
  return network === "solana-mainnet" ? "production" : "devnet";
}

export function assertStripe3ProgramConfigured(mode = "devnet") {
  const config = getStripe3Network(mode);

  if (!config.programId) {
    throw new Error("Mainnet program ID is not configured yet. Deploy stripe3 to mainnet and set VITE_STRIPE3_MAINNET_PROGRAM_ID.");
  }

  return config;
}

export function createStripe3Connection(mode = "devnet") {
  const config = getStripe3Network(mode);
  return new Connection(config.rpcUrl, "confirmed");
}

export function formatSolanaNetwork(network = "solana-devnet") {
  return network === "solana-mainnet" ? "Solana mainnet" : "Solana devnet";
}
