import { Badge, Button, Panel } from "../ui";

export function LifiFundingPanel({ mode, onModeChange }) {
  const production = mode === "production";

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone={production ? "green" : "blue"}>{production ? "LI.FI active" : "Funding path"}</Badge>
          <div className="mt-4 panel-title">Need Solana funds?</div>
          <p className="panel-copy">
            Use LI.FI to bridge or swap from another chain into Solana before paying.
          </p>
        </div>
      </div>

      <div className="data-list mt-5">
        <div className="data-line">
          <span>Start</span>
          <strong>Any LI.FI-supported chain</strong>
        </div>
        <div className="data-line">
          <span>Destination</span>
          <strong>Solana wallet</strong>
        </div>
        <div className="data-line">
          <span>Use</span>
          <strong>Fund wallet, then pay invoice</strong>
        </div>
      </div>

      <div className="timeline mt-5">
        <div className="timeline-row">
          <span>01</span>
          <div>
            <strong>Fund</strong>
            <p>Route value into Solana.</p>
          </div>
          <span className="status-check">ready</span>
        </div>
        <div className="timeline-row">
          <span>02</span>
          <div>
            <strong>Pay</strong>
            <p>Complete the x402 invoice.</p>
          </div>
          <span className="status-check">next</span>
        </div>
      </div>

      <Button
        className="mt-5 w-full"
        variant={production ? "primary" : "secondary"}
        onClick={production ? undefined : onModeChange}
      >
        {production ? "Fund with LI.FI" : "Switch to production"}
      </Button>
    </Panel>
  );
}
