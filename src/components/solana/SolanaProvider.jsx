import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useStandardWalletAdapters } from "@solana/wallet-standard-wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolanaProvider({ children }) {
  const endpoint = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl("devnet");
  const fallbackAdapters = useMemo(() => [], []);
  const wallets = useStandardWalletAdapters(fallbackAdapters);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
