import { ResourceCard } from "../components/resources/ResourceCard";
import { ResourceForm } from "../components/resources/ResourceForm";

export function Resources({
  mode,
  resources = [],
  resourcesLoading,
  resourcesError,
  onPurchaseResource,
  onViewIntegration,
  onResourceCreated,
  onTakeDownResource,
  takingDownResourceId,
}) {
  const liveResources = resources.filter((resource) => resource.status === "Live").length;

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Merchant products
          </div>
          <h1 className="page-title">Turn any resource into a paid endpoint.</h1>
          <p className="page-copy">
            Register APIs, AI tools, datasets, links, or files. stripe3 gives each product an invoice path and receipt verification flow.
          </p>
        </div>
      </header>

      <section className="resource-summary">
        <div>
          <span>Live resources</span>
          <strong>{liveResources}</strong>
        </div>
        <div>
          <span>Network mode</span>
          <strong>{mode === "production" ? "Production" : "Devnet"}</strong>
        </div>
        <div>
          <span>Gateway</span>
          <strong>x402 + Solana receipts</strong>
        </div>
      </section>

      {resourcesError && (
        <div className="form-status error">
          Gateway notice: {resourcesError}
        </div>
      )}

      <section className="resource-grid">
        {resourcesLoading && <div className="panel-copy">Loading resources...</div>}
        {!resourcesLoading && resources.length === 0 && (
          <div className="empty-resource-state">
            <div className="panel-title">No paid resources yet</div>
            <p className="panel-copy">
              Connect a seller wallet and create the first product below. Once the Solana Product PDA is confirmed, it will appear here for buyers.
            </p>
          </div>
        )}
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onPurchaseResource={onPurchaseResource}
            onViewIntegration={onViewIntegration}
            onTakeDownResource={onTakeDownResource}
            takingDown={takingDownResourceId === resource.id}
          />
        ))}
      </section>

      <section>
        <ResourceForm mode={mode} onResourceCreated={onResourceCreated} />
      </section>
    </div>
  );
}
