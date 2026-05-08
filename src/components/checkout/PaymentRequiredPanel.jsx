import { formatLamports } from "../../lib/utils";
import { Badge, Button, Panel } from "../ui";

export function PaymentRequiredPanel({ resource, onPay }) {
  return (
    <Panel className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone="yellow">402 Payment Required</Badge>
          <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-text-primary">Resource locked</h3>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-text-muted">
            Complete the Solana invoice to receive an access receipt.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tracking-[-0.05em] text-text-primary">
            {formatLamports(resource.priceLamports)}
          </div>
          <div className="mt-1 text-xs font-extrabold text-text-muted">required</div>
        </div>
      </div>

      <div className="code-block">
        <div>GET {resource.endpoint}</div>
        <div>{"->"} 402 Payment Required</div>
        <div>network: solana-devnet</div>
        <div>asset: SOL</div>
        <div>invoice: pending</div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onPay}>Pay invoice</Button>
        <Button variant="secondary">Check access</Button>
      </div>
    </Panel>
  );
}
