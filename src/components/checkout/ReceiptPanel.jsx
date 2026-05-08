import { Badge, DataLine, Panel } from "../ui";

export function ReceiptPanel({ paid }) {
  return (
    <Panel>
      <Badge tone={paid ? "green" : "blue"}>{paid ? "Receipt verified" : "Awaiting payment"}</Badge>
      <div className="mt-4 panel-title">Access receipt</div>
      <p className="panel-copy">
        Proof that this wallet paid for this resource.
      </p>
      <div className="data-list mt-5">
        <DataLine label="Status" value={paid ? "Verified onchain" : "No receipt yet"} />
        <DataLine label="Receipt" value={paid ? "rcpt_7Kv..." : "Generated after payment"} />
        <DataLine label="Access" value={paid ? "Unlocked" : "Locked"} />
      </div>
    </Panel>
  );
}
