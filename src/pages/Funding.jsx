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
            LI.FI gives buyers a route from supported chains into Solana. This funding path is independent from devnet payment testing.
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
            {production ? "Mainnet routes" : "Devnet demo"}
          </Badge>
          <h2>Why this is separate</h2>
          <p>
            stripe3 uses devnet for the full x402 demo. LI.FI runs on production liquidity, so it can be shown as the mainnet funding rail without creating a mainnet product first.
          </p>
          <div className="data-list">
            <DataLine label="Payment demo" value="Solana devnet" />
            <DataLine label="Funding demo" value="LI.FI mainnet" />
            <DataLine label="Destination" value="Solana wallet" />
          </div>
        </Panel>

        <Panel className="funding-widget-panel">
          {production ? (
            <LiFiFundingPanel />
          ) : (
            <div className="funding-locked">
              <div className="panel-title">LI.FI is shown in Production mode</div>
              <p className="panel-copy">
                Switch mode to preview the bridge/swap widget. No mainnet stripe3 product is required for this funding demo.
              </p>
              <Button onClick={onModeChange}>Open Production Funding</Button>
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}
