import { networkModes, resources, stats } from "../lib/data";
import { MetricCard, Panel, Badge, DataLine } from "../components/ui";

export function Dashboard({ mode }) {
  const activeMode = networkModes[mode];

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Payment gateway console
          </div>
          <h1 className="page-title">x402 checkout for Solana resources.</h1>
          <p className="page-copy">
            Monitor protected resources, invoices, receipts, and the production LI.FI funding path from one workspace.
          </p>
        </div>
        <Panel className="min-w-[320px]">
          <Badge tone={mode === "sandbox" ? "blue" : "green"}>{activeMode.label}</Badge>
          <div className="data-list mt-7">
            <DataLine label="Network" value={activeMode.network} />
            <DataLine label="Asset" value={activeMode.asset} />
            <DataLine label="LI.FI" value={activeMode.lifi} />
          </div>
        </Panel>
      </header>

      <section className="three-grid">
        {stats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="section-grid">
        <Panel>
          <div className="panel-title">Live resource queue</div>
          <p className="panel-copy">Resources configured for checkout.</p>
          <div className="timeline mt-5">
            {resources.map((resource, index) => (
              <div className="timeline-row" key={resource.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{resource.title}</strong>
                  <p>{resource.endpoint}</p>
                </div>
                <span className={resource.status === "Live" ? "status-check" : "text-text-muted"}>{resource.status}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="panel-title">System path</div>
          <p className="panel-copy">
            Sandbox handles devnet receipts. Production enables LI.FI funding.
          </p>
          <div className="data-list mt-5">
            <DataLine label="Payment" value="x402" />
            <DataLine label="Proof" value="Receipt PDA" />
            <DataLine label="Funding" value="LI.FI" />
          </div>
        </Panel>
      </section>
    </div>
  );
}
