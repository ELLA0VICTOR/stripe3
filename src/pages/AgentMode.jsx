import { AgentConsole } from "../components/agent/AgentConsole";
import { AgentLog } from "../components/agent/AgentLog";
import { Panel, DataLine } from "../components/ui";

export function AgentMode() {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Autonomous payments
          </div>
          <h1 className="page-title">Agent checkout.</h1>
          <p className="page-copy">
            Agents can read a 402 response, pay an invoice, and retry the request with proof.
          </p>
        </div>
      </header>

      <section className="section-grid">
        <AgentConsole />
        <div className="grid gap-6">
          <AgentLog />
          <Panel>
            <div className="panel-title">Agent wallet policy</div>
            <p className="panel-copy">Controls keep automated spend limited.</p>
            <div className="data-list mt-5">
              <DataLine label="Spend cap" value="0.02 SOL" />
              <DataLine label="Allowed network" value="Solana devnet" />
              <DataLine label="Allowed endpoint" value="/premium-signal" />
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
