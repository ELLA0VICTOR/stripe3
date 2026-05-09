import { useState } from "react";
import { formatAddress, formatLamports, getSolanaExplorerUrl } from "../../lib/utils";
import { Badge, Button, DataLine, Panel } from "../ui";

function getUnlockedContent(paymentResult) {
  return paymentResult?.unlock?.payload?.signal || "Unlocked content is available.";
}

export function UnlockedContentModal({ paymentResult, resource, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!paymentResult) return null;

  const content = getUnlockedContent(paymentResult);
  const unlockedFile = paymentResult?.unlock?.payload?.file;
  const paidResource = resource || paymentResult.resource;
  const network = paidResource?.network || paymentResult.settlement?.network || "solana-devnet";
  const productPda = paymentResult.product || paidResource?.productPda;

  async function copyContent() {
    if (!navigator.clipboard) return;

    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

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

        <div className="unlocked-content-head">
          <span>Unlocked payload</span>
          <Button variant="secondary" onClick={copyContent}>{copied ? "Copied" : "Copy"}</Button>
        </div>

        <div className="unlocked-content-box">
          <pre>{content}</pre>
        </div>

        {unlockedFile?.url && (
          <div className="unlocked-file-box">
            <div>
              <span>File</span>
              <strong>{unlockedFile.name}</strong>
            </div>
            {unlockedFile.type?.startsWith("image/") && (
              <img src={unlockedFile.url} alt={unlockedFile.name} />
            )}
            <a className="button button-secondary" href={unlockedFile.url} target="_blank" rel="noreferrer">
              Open file
            </a>
          </div>
        )}

        <div className="data-list mt-5">
          {paidResource && <DataLine label="Resource" value={paidResource.title} />}
          {paidResource && <DataLine label="Amount" value={formatLamports(paidResource.priceLamports)} />}
          <DataLine label="Receipt" value={paymentResult.receipt ? formatAddress(paymentResult.receipt) : "Verified"} />
          <DataLine label="Signature" value={paymentResult.signature ? formatAddress(paymentResult.signature) : "Existing receipt"} />
        </div>

        <div className="proof-actions">
          {paymentResult.receipt && (
            <a
              className="proof-link"
              href={getSolanaExplorerUrl(paymentResult.receipt, network)}
              target="_blank"
              rel="noreferrer"
            >
              View receipt
            </a>
          )}
          {paymentResult.signature && (
            <a
              className="proof-link"
              href={getSolanaExplorerUrl(paymentResult.signature, network, "tx")}
              target="_blank"
              rel="noreferrer"
            >
              View transaction
            </a>
          )}
          {productPda && (
            <a
              className="proof-link"
              href={getSolanaExplorerUrl(productPda, network)}
              target="_blank"
              rel="noreferrer"
            >
              View product
            </a>
          )}
        </div>

        <div className="modal-actions single">
          <Button onClick={onClose}>Continue</Button>
        </div>
      </Panel>
    </div>
  );
}
