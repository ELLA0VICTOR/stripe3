import { navItems } from "../../lib/data";
import { TopBar } from "./TopBar";

export function Layout({ children, activePage, setActivePage, connected, onConnect, mode, onModeChange }) {
  const inWorkspace = activePage !== "landing";

  return (
    <div className="app-shell">
      <TopBar
        activePage={activePage}
        setActivePage={setActivePage}
        connected={connected}
        onConnect={onConnect}
        mode={mode}
        onModeChange={onModeChange}
      />

      <main className={inWorkspace ? "main workspace-main" : "main landing-main"}>
        <div className="content">
          {inWorkspace && (
            <nav className="workspace-tabs" aria-label="Workspace tabs">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={activePage === item.id ? "active" : ""}
                  onClick={() => setActivePage(item.id)}
                >
                  <span>{item.glyph}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
