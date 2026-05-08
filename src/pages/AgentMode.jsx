import { AgentConsole } from "../components/agent/AgentConsole";
import { AgentLog } from "../components/agent/AgentLog";
import { Button, Panel, DataLine } from "../components/ui";

export function AgentMode({ resource, mode, paymentStarted, paymentResult, setActivePage }) {
  if (!paymentStarted) {
    return (
      <div className="page-stack">
        <header className="page-header">
          <div>
            <div className="page-kicker">
              <span className="dot" />
              Payment activity
            </div>
            <h1 className="page-title">No active payment yet.</h1>
            <p className="page-copy">
              Choose a resource first, then confirm payment to start the x402 activity log.
            </p>
          </div>
        </header>

        <Panel className="empty-state">
          <div className="panel-title">Start from Resources</div>
          <p className="panel-copy">Purchase access to an API, AI tool, or dataset to see the payment flow here.</p>
          <Button className="mt-5" onClick={() => setActivePage("resources")}>
            Browse resources
          </Button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Autonomous payments
          </div>
          <h1 className="page-title">Payment activity.</h1>
          <p className="page-copy">
            The x402 flow starts after payment confirmation and shows each step as the resource unlocks.
          </p>
        </div>
      </header>

      <section className="section-grid">
        <AgentConsole resource={resource} mode={mode} paymentResult={paymentResult} />
        <div className="grid gap-6">
          <AgentLog resource={resource} paymentResult={paymentResult} />
          <Panel>
            <div className="panel-title">Payment policy</div>
            <p className="panel-copy">Limits keep automated payments controlled.</p>
            <div className="data-list mt-5">
              <DataLine label="Spend cap" value="0.02 SOL" />
              <DataLine label="Network" value={mode === "production" ? "Solana mainnet" : "Solana devnet"} />
              <DataLine label="Endpoint" value={resource.endpoint} />
              <DataLine label="Receipt" value={paymentResult?.receipt || "Pending"} />
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
