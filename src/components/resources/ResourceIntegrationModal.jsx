import { useMemo, useState } from "react";
import { GATEWAY_URL } from "../../lib/gatewayClient";
import { formatSolanaNetwork } from "../../lib/networks";
import { formatAddress, getSolanaExplorerUrl } from "../../lib/utils";
import { Badge, Button, DataLine, Panel } from "../ui";

function resourceUrl(resource) {
  return `${GATEWAY_URL.replace(/\/$/, "")}${resource.endpoint}`;
}

export function ResourceIntegrationModal({ resource, onClose }) {
  const [copied, setCopied] = useState("");
  const endpoint = resource ? resourceUrl(resource) : "";
  const curl = useMemo(() => (
    resource
      ? `curl -i "${endpoint}"\n# 402 until a Solana receipt is attached`
      : ""
  ), [endpoint, resource]);

  if (!resource) return null;

  async function copy(text, label) {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  const productPda = resource.productPda;

  return (
    <div className="modal-backdrop" role="presentation">
      <Panel className="payment-modal integration-modal" role="dialog" aria-modal="true" aria-label="Resource integration">
        <div className="modal-head">
          <div>
            <Badge tone="blue">Integration</Badge>
            <h2>{resource.title}</h2>
            <p>Call the endpoint. stripe3 returns payment terms until access is paid and verified.</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close integration modal">
            X
          </button>
        </div>

        <div className="data-list mt-5">
          <DataLine label="Endpoint" value={resource.endpoint} />
          <DataLine label="Network" value={formatSolanaNetwork(resource.network)} />
          <DataLine label="Merchant" value={formatAddress(resource.merchant)} />
          {productPda && <DataLine label="Product PDA" value={formatAddress(productPda)} />}
        </div>

        <pre className="code-block integration-code">{curl}</pre>

        <div className="proof-actions">
          <button className="proof-link" type="button" onClick={() => copy(endpoint, "endpoint")}>
            {copied === "endpoint" ? "Copied" : "Copy endpoint"}
          </button>
          <button className="proof-link" type="button" onClick={() => copy(curl, "curl")}>
            {copied === "curl" ? "Copied" : "Copy curl"}
          </button>
          {productPda && (
            <a
              className="proof-link"
              href={getSolanaExplorerUrl(productPda, resource.network)}
              target="_blank"
              rel="noreferrer"
            >
              View product
            </a>
          )}
        </div>

        <div className="modal-actions single">
          <Button onClick={onClose}>Close</Button>
        </div>
      </Panel>
    </div>
  );
}
