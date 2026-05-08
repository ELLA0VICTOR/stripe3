import { formatAddress, formatLamports } from "../../lib/utils";
import { Badge, Button, DataLine, Panel } from "../ui";

export function ResourceCard({ resource, onOpenCheckout }) {
  return (
    <Panel className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone={resource.status === "Live" ? "green" : "yellow"}>{resource.status}</Badge>
          <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-text-primary">{resource.title}</h3>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-text-muted">{resource.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tracking-[-0.05em] text-text-primary">
            {formatLamports(resource.priceLamports)}
          </div>
          <div className="mt-1 text-xs font-extrabold text-text-muted">x402 price</div>
        </div>
      </div>

      <div className="data-list">
        <DataLine label="Type" value={resource.type} />
        <DataLine label="Endpoint" value={resource.endpoint} />
        <DataLine label="Merchant" value={formatAddress(resource.merchant)} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => onOpenCheckout(resource.id)}>Open checkout</Button>
        <Button variant="secondary">Copy x402 URL</Button>
      </div>
    </Panel>
  );
}
