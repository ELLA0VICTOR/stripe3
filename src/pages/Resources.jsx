import { ResourceCard } from "../components/resources/ResourceCard";
import { ResourceForm } from "../components/resources/ResourceForm";
import { resources } from "../lib/data";

export function Resources({ onOpenCheckout }) {
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

      <section className="section-grid">
        <div className="grid gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onOpenCheckout={onOpenCheckout} />
          ))}
        </div>
        <ResourceForm />
      </section>
    </div>
  );
}
