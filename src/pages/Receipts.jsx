import { receipts } from "../lib/data";
import { Badge, DataLine, Panel } from "../components/ui";

export function Receipts() {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Onchain proof
          </div>
          <h1 className="page-title">Access receipts.</h1>
          <p className="page-copy">
            The gateway unlocks resources by checking Solana receipt PDAs.
          </p>
        </div>
      </header>

      <section className="grid gap-6">
        {receipts.map((receipt) => (
          <Panel key={receipt.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge tone="green">{receipt.status}</Badge>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-text-primary">{receipt.resource}</h3>
              </div>
              <div className="text-right text-xl font-black text-text-primary">{receipt.amount}</div>
            </div>
            <div className="data-list mt-5">
              <DataLine label="Buyer" value={receipt.buyer} />
              <DataLine label="Receipt PDA" value={receipt.pda} />
              <DataLine label="Time" value={receipt.timestamp} />
            </div>
          </Panel>
        ))}
      </section>
    </div>
  );
}
