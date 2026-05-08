import { connectedWallet, navItems } from "../../lib/data";
import { formatAddress } from "../../lib/utils";
import { Button } from "../ui";
import { LogoMark } from "../ui/Logo";

export function TopBar({ activePage, setActivePage, connected, onConnect, mode, onModeChange }) {
  const inWorkspace = activePage !== "landing";

  return (
    <header className="topbar">
      <button type="button" className="brand" onClick={() => setActivePage("landing")}>
        <span className="brand-mark">
          <LogoMark className="h-6 w-6" />
        </span>
        <span>stripe3</span>
      </button>

      <nav className="site-nav" aria-label="Primary">
        <button type="button" onClick={() => setActivePage("landing")} className={activePage === "landing" ? "active" : ""}>
          Overview
        </button>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActivePage(item.id)}
            className={activePage === item.id ? "active" : ""}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="topbar-actions">
        {inWorkspace && (
          <span className={`mode-badge ${mode === "sandbox" ? "sandbox" : "production"}`}>
            <LogoMark className="mode-badge-mark" />
            {mode === "sandbox" ? "Sandbox" : "Production"}
          </span>
        )}
        {inWorkspace && (
          <Button variant="secondary" onClick={onModeChange}>
            Switch mode
          </Button>
        )}
        {connected ? (
          <Button variant="secondary">{formatAddress(connectedWallet)}</Button>
        ) : (
          <Button onClick={onConnect}>Connect</Button>
        )}
      </div>
    </header>
  );
}
