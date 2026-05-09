import { LiFiFundingPanel } from "../components/funding/LiFiFundingPanel";
import { Button, Panel } from "../components/ui";

export function Funding({ mode = "devnet", onModeChange }) {
  const production = mode === "production";

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Production funding
          </div>
          <h1 className="page-title">Bridge into Solana before checkout.</h1>
          <p className="page-copy">
            Use LI.FI to bridge or swap from supported chains into a Solana wallet.
          </p>
        </div>
        {!production && (
          <Button variant="secondary" onClick={onModeChange}>
            Switch to Production
          </Button>
        )}
      </header>

      <Panel className="funding-widget-panel">
        {production ? (
          <LiFiFundingPanel />
        ) : (
          <div className="funding-locked">
            <Button onClick={onModeChange}>Open Production Funding</Button>
          </div>
        )}
      </Panel>
    </div>
  );
}
