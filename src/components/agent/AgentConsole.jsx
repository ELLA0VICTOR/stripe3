import { formatSolanaNetwork } from "../../lib/networks";
import { formatAddress, formatLamports } from "../../lib/utils";
import { Badge, DataLine, Panel } from "../ui";

function stepStatus(index, activeStep) {
  if (index < activeStep) return "done";
  if (index === activeStep) return "active";
  return "waiting";
}

export function AgentConsole({ resource, mode, paymentResult, activeStep = 0 }) {
  const steps = [
    {
      label: "Request",
      detail: `GET ${resource.endpoint}`,
    },
    {
      label: "402",
      detail: "Gateway returns payment terms.",
    },
    {
      label: "Pay",
      detail: "Wallet signs the Solana payment.",
    },
    {
      label: "Receipt",
      detail: "Receipt PDA verifies access.",
    },
    {
      label: "Unlock",
      detail: "Protected resource is served.",
    },
  ];

  return (
    <Panel className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone="blue">x402 flow</Badge>
          <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-text-primary">{resource.title}</h3>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-text-muted">
            Payment confirmed. stripe3 is verifying the receipt and preparing the protected response.
          </p>
          <div className="trace-progress" aria-label="Payment trace progress">
            <span style={{ width: `${Math.min(activeStep, steps.length) / steps.length * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="data-list">
        <DataLine label="Amount" value={formatLamports(resource.priceLamports)} />
        <DataLine label="Network" value={formatSolanaNetwork(resource.network || (mode === "production" ? "solana-mainnet" : "solana-devnet"))} />
        <DataLine label="Endpoint" value={resource.endpoint} />
        <DataLine label="Receipt" value={paymentResult?.receipt ? formatAddress(paymentResult.receipt) : "Pending"} />
        <DataLine label="Signature" value={paymentResult?.signature ? formatAddress(paymentResult.signature) : "Existing receipt"} />
      </div>

      <div className="timeline">
        {steps.map((step, index) => {
          const status = stepStatus(index, activeStep);

          return (
          <div className="timeline-row" key={step.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{step.label}</strong>
              <p>{step.detail}</p>
            </div>
            <span className={`trace-status ${status}`}>
              {status === "active" && <i />}
              {status === "done" ? "done" : status === "active" ? "processing" : "waiting"}
            </span>
          </div>
          );
        })}
      </div>
    </Panel>
  );
}
