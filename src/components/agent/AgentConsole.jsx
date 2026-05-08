import { agentSteps } from "../../lib/data";
import { Badge, Button, Panel } from "../ui";

export function AgentConsole() {
  return (
    <Panel className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone="blue">Agent</Badge>
          <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-text-primary">Payment run</h3>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-text-muted">
            A compact view of request, payment, receipt, and retry.
          </p>
        </div>
        <Button>Run flow</Button>
      </div>

      <div className="timeline">
        {agentSteps.map((step, index) => (
          <div className="timeline-row" key={step.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{step.label}</strong>
              <p>{step.detail}</p>
            </div>
            <span className={step.status === "queued" ? "text-text-muted" : "status-check"}>{step.status}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
