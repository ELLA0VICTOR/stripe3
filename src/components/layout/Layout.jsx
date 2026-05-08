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
          {children}
        </div>
      </main>
    </div>
  );
}
