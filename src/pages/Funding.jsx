import { LiFiFundingPanel } from "../components/funding/LiFiFundingPanel";
import { Button, Panel } from "../components/ui";

export function Funding({ mode = "devnet", onModeChange }) {
  const production = mode === "production";

  return (
    <div className="page-stack funding-page">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            LI.FI funding
          </div>
          <h1 className="page-title">Bridge into Solana.</h1>
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
