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
          <p className="panel-copy">Demo resources already configured for the first walkthrough.</p>
          <div className="timeline mt-8">
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
          <div className="panel-title">Judge-ready story</div>
          <p className="panel-copy">
            Sandbox Mode proves the Solana x402 receipt flow safely. Production Mode shows the mainnet LI.FI funding route.
          </p>
          <div className="data-list mt-7">
            <DataLine label="Track fit" value="Solana + LI.FI + x402" />
            <DataLine label="Core proof" value="Receipt PDA" />
            <DataLine label="User pull" value="Paid resources" />
          </div>
        </Panel>
      </section>
    </div>
  );
}
