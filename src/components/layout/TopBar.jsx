import { demoWallet, navItems } from "../../lib/data";
import { formatAddress } from "../../lib/utils";
import { Button, Badge } from "../ui";
import { LogoMark } from "../ui/Logo";

export function TopBar({ activePage, setActivePage, connected, onConnect, mode, onModeChange }) {
  const inWorkspace = activePage !== "landing";

  return (
    <header className="topbar">
      <button type="button" className="brand" onClick={() => setActivePage("landing")}>
        <span className="brand-mark">
          <LogoMark className="h-5 w-5" />
        </span>
        <span>stripe3</span>
      </button>

      <nav className="site-nav" aria-label="Primary">
        <button type="button" onClick={() => setActivePage("landing")} className={activePage === "landing" ? "active" : ""}>
          Overview
        </button>
        {navItems.slice(0, 3).map((item) => (
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
          <Badge tone={mode === "sandbox" ? "blue" : "green"}>
            {mode === "sandbox" ? "Sandbox" : "Production"}
          </Badge>
        )}
        {inWorkspace && (
          <Button variant="secondary" onClick={onModeChange}>
            Switch mode
          </Button>
        )}
        {connected ? (
          <Button variant="secondary">{formatAddress(demoWallet)}</Button>
        ) : (
          <Button onClick={onConnect}>Connect</Button>
        )}
      </div>
    </header>
  );
}
