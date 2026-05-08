import { landingFeatures, networkModes, stats } from "../lib/data";
import { Badge, Button, MetricCard, Panel } from "../components/ui";

export function Landing({ setActivePage, mode }) {
  const activeMode = networkModes[mode];

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="hero-copy-block">
          <div className="eyebrow">
            <span className="dot" />
            Cross-chain x402 gateway
          </div>
          <h1 className="hero-title">Checkout rails for paid APIs and AI agents.</h1>
          <p className="hero-copy">
            stripe3 adds payment-required checkout to APIs, AI tools, datasets, and digital resources.
            Solana stores access receipts. LI.FI helps users fund the wallet they pay from.
          </p>
          <div className="hero-actions">
            <Button onClick={() => setActivePage("checkout")}>Open checkout</Button>
            <Button variant="secondary" onClick={() => setActivePage("developers")}>
              View integration
            </Button>
          </div>
        </div>

        <Panel className="terminal-card">
          <div className="terminal-top">
            <Badge tone="yellow">HTTP 402</Badge>
            <span>$0.003</span>
          </div>
          <div className="terminal-lines">
            <div>
              <span>request</span>
              <strong>GET /premium-signal</strong>
            </div>
            <div>
              <span>response</span>
              <strong>402 Payment Required</strong>
            </div>
            <div>
              <span>settlement</span>
              <strong>{activeMode.network}</strong>
            </div>
            <div>
              <span>proof</span>
              <strong>receipt PDA</strong>
            </div>
          </div>
        </Panel>
      </section>

      <section className="landing-strip">
        {stats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="feature-matrix">
        <div className="matrix-copy">
          <div className="page-kicker">PRODUCT SURFACE</div>
          <h2>One gateway, four jobs.</h2>
          <p>
            The product connects protected resources, payment terms, Solana receipts, and optional
            cross-chain funding.
          </p>
        </div>
        <div className="matrix-grid">
          {landingFeatures.map((feature, index) => (
            <Panel key={feature.title} className="feature-cell">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="flow-board">
        {["Request", "402 terms", "Solana pay", "Receipt", "Unlock"].map((step, index) => (
          <div key={step} className="flow-step">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </section>
    </div>
  );
}
