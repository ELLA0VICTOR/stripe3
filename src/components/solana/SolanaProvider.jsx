import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useStandardWalletAdapters } from "@solana/wallet-standard-wallet-adapter-react";
import { getStripe3Network } from "../../lib/networks";

export function SolanaProvider({ children, mode = "devnet" }) {
  const network = getStripe3Network(mode);
  const endpoint = network.rpcUrl || clusterApiUrl(network.cluster);
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
