import { ResourceCard } from "../components/resources/ResourceCard";
import { ResourceForm } from "../components/resources/ResourceForm";

export function Resources({
  resources = [],
  resourcesLoading,
  resourcesError,
  onPurchaseResource,
  onResourceCreated,
}) {
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

      {resourcesError && (
        <div className="form-status error">
          Gateway notice: {resourcesError}
        </div>
      )}

      <section className="resource-grid">
        {resourcesLoading && <div className="panel-copy">Loading resources...</div>}
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} onPurchaseResource={onPurchaseResource} />
        ))}
      </section>

      <section>
        <ResourceForm onResourceCreated={onResourceCreated} />
      </section>
    </div>
  );
}
