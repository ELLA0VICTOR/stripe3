import { useMemo, useState } from "react";
import { Layout } from "./components/layout/Layout";
import { resources } from "./lib/data";
import { getResourceById } from "./lib/utils";
import { Landing } from "./pages/Landing";
import { Resources } from "./pages/Resources";
import { Checkout } from "./pages/Checkout";
import { AgentMode } from "./pages/AgentMode";
import { Receipts } from "./pages/Receipts";
import { Developers } from "./pages/Developers";

const pageMap = {
  landing: Landing,
  resources: Resources,
  checkout: Checkout,
  agent: AgentMode,
  receipts: Receipts,
  developers: Developers,
};

function App() {
  const [activePage, setActivePage] = useState("landing");
  const [connected, setConnected] = useState(false);
  const [mode, setMode] = useState("sandbox");
  const [selectedResourceId, setSelectedResourceId] = useState(resources[0].id);

  const selectedResource = useMemo(
    () => getResourceById(resources, selectedResourceId),
    [selectedResourceId],
  );

  const Page = pageMap[activePage] || Landing;

  function openCheckout(resourceId) {
    setSelectedResourceId(resourceId);
    setActivePage("checkout");
  }

  function toggleMode() {
    setMode((current) => (current === "sandbox" ? "production" : "sandbox"));
  }

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      connected={connected}
      onConnect={() => setConnected(true)}
      mode={mode}
      onModeChange={toggleMode}
    >
      <Page
        mode={mode}
        onModeChange={toggleMode}
        setActivePage={setActivePage}
        resource={selectedResource}
        onOpenCheckout={openCheckout}
      />
      <footer className="site-footer">
        <span>stripe3 / x402 payment gateway for Solana resources</span>
        <span>Need Solana funds? Fund through LI.FI in production.</span>
      </footer>
    </Layout>
  );
}

export default App;
