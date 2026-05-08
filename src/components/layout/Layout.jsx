import { TopBar } from "./TopBar";

export function Layout({ children, activePage, setActivePage, mode, onModeChange }) {
  const inWorkspace = activePage !== "landing";

  return (
    <div className="app-shell">
      <TopBar
        activePage={activePage}
        setActivePage={setActivePage}
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
