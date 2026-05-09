import { useMemo, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { requestPaymentTerms, unlockProtectedResource } from "../../lib/gatewayClient";
import { createStripe3Connection, getStripe3Network } from "../../lib/networks";
import { formatLamports } from "../../lib/utils";
import { payForResource } from "../../lib/stripe3Program";
import { LiFiFundingPanel } from "../funding/LiFiFundingPanel";
import { Badge, Button, DataLine, Panel } from "../ui";

export function PaymentModal({ resource, mode, onClose, onConfirm }) {
  const wallet = useAnchorWallet();
  const networkConfig = getStripe3Network(mode);
  const connection = useMemo(() => createStripe3Connection(mode), [mode]);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [showFunding, setShowFunding] = useState(false);

  if (!resource) return null;

  const production = mode === "production";
  const buyer = wallet?.publicKey?.toBase58();

  async function handleConfirm() {
    setError("");

    if (!wallet?.publicKey) {
      setError("Connect a Solana wallet first.");
      return;
    }

    try {
      setPaying(true);
      const terms = await requestPaymentTerms(resource, buyer);

      if (terms.paid) {
        onConfirm({
          alreadyVerified: true,
          signature: null,
          receipt: terms.payload?.receipt?.pda,
          unlock: terms.payload,
          settlement: terms.settlement,
        });
        return;
      }

      const result = await payForResource({ connection, wallet, resource });
      const paymentPayload = {
        protocol: "x402",
        x402Version: 2,
        scheme: "solana-transfer",
        network: networkConfig.network,
        resourceId: resource.id,
        buyer,
        product: result.product,
        receipt: result.receipt,
        transactionSignature: result.signature,
        paymentId: `pay_${Date.now().toString(16)}`,
        required: terms.required?.accepts?.[0] || null,
      };
      const unlock = await unlockProtectedResource({
        resource,
        buyer,
        payment: paymentPayload,
      });

      onConfirm({
        ...result,
        paymentRequired: terms.required,
        unlock: unlock.body,
        settlement: unlock.settlement,
      });
    } catch (paymentError) {
      setError(paymentError.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <Panel className={`payment-modal ${showFunding ? "payment-modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label="Confirm payment">
        <div className="modal-head">
          <div>
            <Badge tone="yellow">402 Payment Required</Badge>
            <h2>Confirm access</h2>
            <p>Pay once, receive a Solana receipt, then unlock this resource.</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close payment modal">
            X
          </button>
        </div>

        <div className="data-list mt-5">
          <DataLine label="Resource" value={resource.title} />
          <DataLine label="Endpoint" value={resource.endpoint} />
          <DataLine label="Amount" value={formatLamports(resource.priceLamports)} />
          <DataLine label="Settlement" value={networkConfig.displayName} />
          <DataLine label="Funding" value={production ? "LI.FI mainnet routes" : "Devnet wallet balance"} />
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="funding-note">
          <span>Need Solana funds?</span>
          <button
            type="button"
            onClick={() => {
              if (!production) {
                setError("LI.FI funding is available in Production mode. Stay on Devnet for this test payment.");
                return;
              }
              setShowFunding((current) => !current);
            }}
          >
            {showFunding ? "Hide LI.FI" : "Fund with LI.FI"}
          </button>
        </div>

        {showFunding && (
          <LiFiFundingPanel />
        )}

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
