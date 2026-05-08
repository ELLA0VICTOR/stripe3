import { integrationSnippet } from "../lib/data";
import { Badge, DataLine, Panel } from "../components/ui";

export function Developers() {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Integration docs
          </div>
          <h1 className="page-title">Embed payment-required access.</h1>
          <p className="page-copy">
            Protect a route, return 402, verify a Solana receipt, then serve the resource.
          </p>
        </div>
      </header>

      <section className="section-grid">
        <Panel>
          <Badge tone="blue">Middleware sketch</Badge>
          <pre className="code-block mt-5">{integrationSnippet}</pre>
        </Panel>
        <Panel>
          <div className="panel-title">Build contract</div>
          <p className="panel-copy">Shared objects across the gateway and Solana program.</p>
          <div className="data-list mt-5">
            <DataLine label="Merchant" value="Wallet that receives value" />
            <DataLine label="Product" value="Paid resource definition" />
            <DataLine label="Invoice" value="Payment request" />
            <DataLine label="Receipt" value="Onchain proof of access" />
          </div>
        </Panel>
      </section>
    </div>
  );
}
