import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { EmptyNotice } from "../ui/EmptyNotice";

export function WalletGate({ title = "Connect wallet to continue", copy = "Connect a Solana wallet to view resources, receipts, and payment activity." }) {
  return (
    <div className="page-stack wallet-gate-page">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Wallet required
          </div>
          <h1 className="page-title">{title}</h1>
          <p className="page-copy">{copy}</p>
        </div>
      </header>

      <EmptyNotice
        title="No wallet connected"
        copy="The workspace is hidden until a wallet is connected."
      >
        <WalletMultiButton className="wallet-connect-button wallet-gate-button" />
      </EmptyNotice>
    </div>
  );
}
