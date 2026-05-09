import { LiFiFundingPanel } from "../components/funding/LiFiFundingPanel";
import { Badge, Button, DataLine, Panel } from "../components/ui";

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

      <section className="funding-page-grid">
        <Panel className="funding-brief">
          <Badge tone={production ? "green" : "yellow"}>
            {production ? "Production ready" : "Production mode required"}
          </Badge>
          <h2>Solana funding</h2>
          <div className="data-list">
            <DataLine label="Provider" value="LI.FI" />
            <DataLine label="Destination" value="Solana mainnet" />
            <DataLine label="Use case" value="Fund checkout wallet" />
          </div>
          {!production && <Button onClick={onModeChange}>Open Production Funding</Button>}
        </Panel>

        <Panel className="funding-widget-panel">
          {production ? (
            <LiFiFundingPanel />
          ) : (
            <div className="funding-locked">
              <div className="panel-title">LI.FI is shown in Production mode</div>
              <Button onClick={onModeChange}>Open Production Funding</Button>
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}
