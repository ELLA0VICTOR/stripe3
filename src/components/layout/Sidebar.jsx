import { navItems } from "../../lib/data";

export function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="page-kicker">WORKSPACE</div>
        <p className="mt-4 max-w-[14rem] text-base font-bold leading-7 text-text-muted">
          Cross-chain x402 gateway for Solana-paid resources.
        </p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-button ${activePage === item.id ? "active" : ""}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="text-sm text-text-muted">{item.glyph}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
