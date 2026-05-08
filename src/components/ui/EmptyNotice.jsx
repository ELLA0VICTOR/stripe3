import { Panel } from "./index";

export function EmptyNotice({ title, copy }) {
  return (
    <Panel className="empty-notice">
      <div className="empty-notice-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img">
          <circle cx="32" cy="32" r="24" />
          <path d="M32 18v18" />
          <path d="M32 45h.01" />
        </svg>
      </div>
      <div>
        <div className="panel-title">{title}</div>
        <p className="panel-copy">{copy}</p>
      </div>
    </Panel>
  );
}
