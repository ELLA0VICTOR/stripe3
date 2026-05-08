import { useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { formatLamports } from "../../lib/utils";
import { payForResource } from "../../lib/stripe3Program";
import { Badge, Button, DataLine, Panel } from "../ui";

export function PaymentModal({ resource, mode, onClose, onConfirm, onModeChange }) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  if (!resource) return null;

  const production = mode === "production";

  async function handleConfirm() {
    setError("");

    if (!wallet?.publicKey) {
      setError("Connect a Solana wallet first.");
      return;
    }

    try {
      setPaying(true);
      const result = await payForResource({ connection, wallet, resource });
      onConfirm(result);
    } catch (paymentError) {
      setError(paymentError.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <Panel className="payment-modal" role="dialog" aria-modal="true" aria-label="Confirm payment">
        <div className="modal-head">
          <div>
            <Badge tone="yellow">402 Payment Required</Badge>
            <h2>Confirm access</h2>
            <p>Pay once, receive a Solana receipt, then unlock this resource.</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close payment modal">
            ×
          </button>
        </div>

        <div className="data-list mt-5">
          <DataLine label="Resource" value={resource.title} />
          <DataLine label="Endpoint" value={resource.endpoint} />
          <DataLine label="Amount" value={formatLamports(resource.priceLamports)} />
          <DataLine label="Network" value={production ? "Solana mainnet" : "Solana devnet"} />
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="funding-note">
          <span>Need Solana funds?</span>
          <button type="button" onClick={onModeChange}>
            {production ? "LI.FI funding enabled" : "Switch to production funding"}
          </button>
        </div>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={paying}>
            {paying ? "Confirming..." : "Confirm payment"}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
