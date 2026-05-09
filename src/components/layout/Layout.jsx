import { TopBar } from "./TopBar";

export function Layout({ children, activePage, setActivePage, mode, onModeChange }) {
  const inWorkspace = activePage !== "landing";
  const isFunding = activePage === "funding";

  return (
    <div className="app-shell">
      <TopBar
        activePage={activePage}
        setActivePage={setActivePage}
        mode={mode}
        onModeChange={onModeChange}
      />

      <main className={`${inWorkspace ? "main workspace-main" : "main landing-main"} ${isFunding ? "funding-main" : ""}`}>
        <div className={`content ${isFunding ? "funding-content" : ""}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
