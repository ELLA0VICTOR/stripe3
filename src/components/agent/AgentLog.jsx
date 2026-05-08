import { Panel } from "../ui";

export function AgentLog({ resource, paymentResult, activeStep = 0 }) {
  const logs = [
    ["00:01", "REQUEST", `GET ${resource.endpoint}`],
    ["00:02", "402", "Payment required. Invoice terms returned."],
    [
      "00:04",
      "PAY",
      paymentResult?.alreadyVerified ? "Existing receipt found for buyer wallet." : "Payment submitted from buyer wallet.",
    ],
    ["00:07", "VERIFY", "Receipt PDA found. Access unlocked."],
    ["00:09", "UNLOCK", "Protected content returned to buyer session."],
  ];
  const visibleLogs = logs.slice(0, Math.min(activeStep + 1, logs.length));

  return (
    <Panel>
      <div className="panel-title">Agent trace</div>
      <p className="panel-copy">Live gateway events for the current payment.</p>
      <div className="mt-5 grid gap-2">
        {visibleLogs.map(([time, type, message], index) => (
          <div key={`${time}-${type}`} className="grid gap-2 border-b border-line py-3 last:border-b-0">
            <div className="flex gap-5 text-xs font-black text-text-muted">
              <span>{time}</span>
              <span className={type === "402" ? "text-yellow" : "text-text-secondary"}>{type}</span>
            </div>
            <p className="text-sm font-bold leading-6 text-text-secondary">{message}</p>
            {index === visibleLogs.length - 1 && activeStep < logs.length && (
              <span className="trace-pulse">listening</span>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
