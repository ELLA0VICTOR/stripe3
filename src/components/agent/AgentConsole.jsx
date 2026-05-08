import { formatAddress, formatLamports } from "../../lib/utils";
import { Badge, DataLine, Panel } from "../ui";

export function AgentConsole({ resource, mode, paymentResult }) {
  const steps = [
    {
      label: "Request",
      detail: `GET ${resource.endpoint}`,
      status: "done",
    },
    {
      label: "402",
      detail: "Gateway returns payment terms.",
      status: "done",
    },
    {
      label: "Pay",
      detail: "Wallet signs the Solana payment.",
      status: "done",
    },
    {
      label: "Receipt",
      detail: "Receipt PDA verifies access.",
      status: "active",
    },
    {
      label: "Unlock",
      detail: "Protected resource is served.",
      status: "next",
    },
  ];

  return (
    <Panel className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone="blue">x402 flow</Badge>
          <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-text-primary">{resource.title}</h3>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-text-muted">
            Payment confirmed. The gateway is checking the receipt and unlocking access.
          </p>
        </div>
      </div>

      <div className="data-list">
        <DataLine label="Amount" value={formatLamports(resource.priceLamports)} />
        <DataLine label="Network" value={mode === "production" ? "Solana mainnet" : "Solana devnet"} />
        <DataLine label="Receipt" value={paymentResult?.receipt ? formatAddress(paymentResult.receipt) : "Pending"} />
        <DataLine label="Signature" value={paymentResult?.signature ? formatAddress(paymentResult.signature) : "Existing receipt"} />
      </div>

      <div className="timeline">
        {steps.map((step, index) => (
          <div className="timeline-row" key={step.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{step.label}</strong>
              <p>{step.detail}</p>
            </div>
            <span className={step.status === "next" ? "text-text-muted" : "status-check"}>{step.status}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
