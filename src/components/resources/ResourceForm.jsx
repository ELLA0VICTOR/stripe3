import { Button, Field, Panel, Select, TextArea, TextInput } from "../ui";

export function ResourceForm() {
  return (
    <Panel>
      <div className="panel-title">Create paid resource</div>
      <p className="panel-copy">
        Register an API, AI tool, dataset, file, or paid page.
      </p>

      <div className="mt-5 grid gap-4">
        <Field label="Resource name">
          <TextInput placeholder="Premium Solana Signal API" />
        </Field>
        <Field label="Resource type">
          <Select defaultValue="api">
            <option value="api">API endpoint</option>
            <option value="agent">AI tool</option>
            <option value="dataset">Dataset</option>
            <option value="file">Digital file</option>
          </Select>
        </Field>
        <Field label="Price in SOL">
          <TextInput placeholder="0.003" />
        </Field>
        <Field label="Description">
          <TextArea placeholder="Explain what the user unlocks after payment." />
        </Field>
        <Button>Create product</Button>
      </div>
    </Panel>
  );
}
