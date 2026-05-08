import { cn } from "../../lib/utils";

export function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button className={cn("button", `button-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}

export function Badge({ children, tone = "", className = "" }) {
  return <span className={cn("badge", tone, className)}>{children}</span>;
}

export function Panel({ children, className = "", padded = true }) {
  return <section className={cn("panel", padded && "pad", className)}>{children}</section>;
}

export function MetricCard({ value, label, sub }) {
  return (
    <div className="metric-card">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-sub">{sub}</div>
    </div>
  );
}

export function DataLine({ label, value }) {
  return (
    <div className="data-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="grid gap-3">
      <span className="text-sm font-extrabold text-text-secondary">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return <input className="input" {...props} />;
}

export function TextArea(props) {
  return <textarea className="textarea" {...props} />;
}

export function Select(props) {
  return <select className="select" {...props} />;
}
