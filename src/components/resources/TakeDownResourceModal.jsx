import { formatAddress, formatLamports } from "../../lib/utils";
import { Badge, Button, DataLine, Panel } from "../ui";

export function TakeDownResourceModal({ resource, busy, onCancel, onConfirm }) {
  if (!resource) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <Panel className="payment-modal danger-modal" role="dialog" aria-modal="true" aria-label="Take down resource">
        <div className="modal-head">
          <div>
            <Badge tone="red">Seller action</Badge>
            <h2>Take down this resource?</h2>
            <p>
              This removes the listing from the shared catalog and disables new on-chain payments for this product.
            </p>
          </div>
          <button className="modal-close" type="button" onClick={onCancel} aria-label="Close take down modal">
            X
          </button>
        </div>

        <div className="danger-summary">
          <div className="panel-title">{resource.title}</div>
          <p className="panel-copy">{resource.description}</p>
          <div className="data-list mt-4">
            <DataLine label="Price" value={formatLamports(resource.priceLamports)} />
            <DataLine label="Endpoint" value={resource.endpoint} />
            <DataLine label="Merchant" value={formatAddress(resource.merchant)} />
          </div>
        </div>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Keep listed
          </Button>
          <Button variant="ghost" className="take-down-button danger-confirm-button" onClick={onConfirm} disabled={busy}>
            {busy ? "Taking down..." : "Take down globally"}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
