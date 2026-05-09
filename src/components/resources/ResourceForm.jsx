import { useMemo, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { registerResource } from "../../lib/gatewayClient";
import { createStripe3Connection, getStripe3Network } from "../../lib/networks";
import { createProduct } from "../../lib/stripe3Program";
import { slugifyResourceId, solToLamports } from "../../lib/utils";
import { Button, Field, Panel, Select, TextArea, TextInput } from "../ui";

const typeLabels = {
  api: "API",
  agent: "AI tool",
  dataset: "Dataset",
  file: "Digital file",
  report: "Report",
  course: "Course",
  template: "Template",
  model: "Model",
  webhook: "Webhook",
  membership: "Membership",
  plugin: "Plugin",
};

export function ResourceForm({ mode = "devnet", onResourceCreated }) {
  const wallet = useAnchorWallet();
  const networkConfig = getStripe3Network(mode);
  const connection = useMemo(() => createStripe3Connection(mode), [mode]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("api");
  const [customType, setCustomType] = useState("");
  const [price, setPrice] = useState("0.003");
  const [description, setDescription] = useState("");
  const [protectedContent, setProtectedContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!wallet?.publicKey) {
      setError("Connect your Solana wallet before creating a product.");
      return;
    }

    try {
      setSubmitting(true);
      const resource = {
        id: slugifyResourceId(title),
        title: title.trim(),
        type: type === "custom" ? customType.trim() : typeLabels[type],
        priceLamports: solToLamports(price),
        merchant: wallet.publicKey.toBase58(),
        network: networkConfig.network,
        programId: networkConfig.programId,
        status: "Live",
        endpoint: "",
        description: description.trim(),
        protectedContent: protectedContent.trim(),
      };

      const product = await createProduct({ connection, wallet, resource });
      const savedResource = await registerResource({
        ...resource,
        productPda: product.product,
        creationSignature: product.signature,
      });

      onResourceCreated?.(savedResource);
      setMessage("Product is live. Buyers can now pay and unlock it.");
      setTitle("");
      setType("api");
      setCustomType("");
      setPrice("0.003");
      setDescription("");
      setProtectedContent("");
    } catch (formError) {
      setError(formError.message || "Unable to create product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Panel className="resource-form">
      <div>
        <div className="panel-title">Create paid resource</div>
        <p className="panel-copy">
          Register any paid digital resource. The product is created on Solana first, then the gateway stores the access metadata.
        </p>
      </div>

      <form className="resource-form-grid" onSubmit={handleSubmit}>
        <Field label="Resource name">
          <TextInput
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Premium Solana Signal API"
            required
          />
        </Field>
        <Field label="Resource type">
          <Select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="api">API endpoint</option>
            <option value="agent">AI tool</option>
            <option value="dataset">Dataset</option>
            <option value="file">Digital file</option>
            <option value="report">Research report</option>
            <option value="course">Course access</option>
            <option value="template">Template</option>
            <option value="model">Model / prompt pack</option>
            <option value="webhook">Webhook</option>
            <option value="membership">Membership</option>
            <option value="plugin">Plugin / extension</option>
            <option value="custom">Custom type</option>
          </Select>
        </Field>
        {type === "custom" && (
          <Field label="Custom type">
            <TextInput
              value={customType}
              onChange={(event) => setCustomType(event.target.value)}
              placeholder="Private community, signal room, license key..."
              required
            />
          </Field>
        )}
        <Field label="Price in SOL">
          <TextInput
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            inputMode="decimal"
            placeholder="0.003"
            required
          />
        </Field>
        <Field label="Description" className="form-wide">
          <TextArea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Explain what the user unlocks after payment."
            required
          />
        </Field>
        <Field label="Protected content" className="form-wide">
          <TextArea
            value={protectedContent}
            onChange={(event) => setProtectedContent(event.target.value)}
            placeholder="Paste the private response, link, API credential note, or dataset instructions buyers should receive."
            required
          />
        </Field>
        <div className="form-submit">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create product"}
          </Button>
        </div>
        {message && <div className="form-status">{message}</div>}
        {error && <div className="form-status error">{error}</div>}
      </form>
    </Panel>
  );
}
