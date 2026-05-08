import { Panel } from "../ui";

export function AgentLog({ resource, paymentResult }) {
  const logs = [
    ["00:01", "REQUEST", `GET ${resource.endpoint}`],
    ["00:02", "402", "Payment required. Invoice terms returned."],
    [
      "00:04",
      "PAY",
      paymentResult?.alreadyVerified ? "Existing receipt found for buyer wallet." : "Payment submitted from buyer wallet.",
    ],
    ["00:07", "VERIFY", "Receipt PDA found. Access unlocked."],
  ];

  return (
    <Panel>
      <div className="panel-title">Agent trace</div>
      <p className="panel-copy">Recent gateway events.</p>
      <div className="mt-5 grid gap-2">
        {logs.map(([time, type, message]) => (
          <div key={`${time}-${type}`} className="grid gap-2 border-b border-line py-3 last:border-b-0">
            <div className="flex gap-5 text-xs font-black text-text-muted">
              <span>{time}</span>
              <span className={type === "402" ? "text-yellow" : "text-text-secondary"}>{type}</span>
            </div>
            <p className="text-sm font-bold leading-6 text-text-secondary">{message}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
