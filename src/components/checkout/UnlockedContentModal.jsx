import { formatAddress } from "../../lib/utils";
import { Badge, Button, DataLine, Panel } from "../ui";

function getUnlockedContent(paymentResult) {
  return paymentResult?.unlock?.payload?.signal || "Unlocked content is available.";
}

export function UnlockedContentModal({ paymentResult, onClose }) {
  if (!paymentResult) return null;

  const content = getUnlockedContent(paymentResult);

  return (
    <div className="modal-backdrop" role="presentation">
      <Panel className="payment-modal unlocked-modal" role="dialog" aria-modal="true" aria-label="Unlocked content">
        <div className="modal-head">
          <div>
            <Badge tone="green">Access unlocked</Badge>
            <h2>Protected content</h2>
            <p>Your Solana receipt was verified. This resource is now available to your wallet.</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close unlocked content modal">
            X
          </button>
        </div>

        <div className="unlocked-content-box">
          <pre>{content}</pre>
        </div>

        <div className="data-list mt-5">
          <DataLine label="Receipt" value={paymentResult.receipt ? formatAddress(paymentResult.receipt) : "Verified"} />
          <DataLine label="Signature" value={paymentResult.signature ? formatAddress(paymentResult.signature) : "Existing receipt"} />
        </div>

        <div className="modal-actions single">
          <Button onClick={onClose}>Continue</Button>
        </div>
      </Panel>
    </div>
  );
}
