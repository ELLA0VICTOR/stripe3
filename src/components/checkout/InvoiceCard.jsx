import { formatAddress, formatLamports } from "../../lib/utils";
import { DataLine, Panel } from "../ui";

export function InvoiceCard({ resource, mode }) {
  return (
    <Panel>
      <div className="panel-title">Invoice</div>
      <p className="panel-copy">Payment terms for this resource.</p>
      <div className="data-list mt-5">
        <DataLine label="Resource" value={resource.title} />
        <DataLine label="Amount" value={formatLamports(resource.priceLamports)} />
        <DataLine label="Network" value={mode === "sandbox" ? "Solana devnet" : "Solana mainnet"} />
        <DataLine label="Merchant" value={formatAddress(resource.merchant)} />
      </div>
    </Panel>
  );
}
