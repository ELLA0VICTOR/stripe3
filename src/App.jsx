import { useEffect, useMemo, useState } from "react";
import { Layout } from "./components/layout/Layout";
import { PaymentModal } from "./components/checkout/PaymentModal";
import { resources as seededResources } from "./lib/data";
import { fetchResources } from "./lib/gatewayClient";
import { getResourceById } from "./lib/utils";
import { Landing } from "./pages/Landing";
import { Resources } from "./pages/Resources";
import { AgentMode } from "./pages/AgentMode";
import { Receipts } from "./pages/Receipts";

const pageMap = {
  landing: Landing,
  resources: Resources,
  agent: AgentMode,
  receipts: Receipts,
};

function App() {
  const [activePage, setActivePage] = useState("landing");
  const [mode, setMode] = useState("sandbox");
  const [resourceList, setResourceList] = useState(seededResources);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState(seededResources[0].id);
  const [paymentResourceId, setPaymentResourceId] = useState(null);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const selectedResource = useMemo(
    () => getResourceById(resourceList, selectedResourceId),
    [resourceList, selectedResourceId],
  );

  const Page = pageMap[activePage] || Landing;

  useEffect(() => {
    let active = true;

    async function loadResources() {
      try {
        setResourcesLoading(true);
        const nextResources = await fetchResources();

        if (!active) return;
        if (nextResources.length) {
          setResourceList(nextResources);
          setSelectedResourceId((current) => (
            nextResources.some((resource) => resource.id === current)
              ? current
              : nextResources[0].id
          ));
        }
        setResourcesError("");
      } catch (error) {
        if (active) setResourcesError(error.message || "Gateway is not reachable.");
      } finally {
        if (active) setResourcesLoading(false);
      }
    }

    loadResources();
    return () => {
      active = false;
    };
  }, []);

  function openPayment(resourceId) {
    setSelectedResourceId(resourceId);
    setPaymentResourceId(resourceId);
  }

  function toggleMode() {
    setMode((current) => (current === "sandbox" ? "production" : "sandbox"));
  }

  function confirmPayment(result) {
    setPaymentResourceId(null);
    setPaymentResult(result);
    setPaymentStarted(true);
    setActivePage("agent");
  }

  function handleResourceCreated(resource) {
    setResourceList((current) => [
      resource,
      ...current.filter((item) => item.id !== resource.id),
    ]);
    setSelectedResourceId(resource.id);
  }

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      mode={mode}
      onModeChange={toggleMode}
    >
      <Page
        mode={mode}
        onModeChange={toggleMode}
        setActivePage={setActivePage}
        resource={selectedResource}
        paymentStarted={paymentStarted}
        paymentResult={paymentResult}
        resources={resourceList}
        resourcesLoading={resourcesLoading}
        resourcesError={resourcesError}
        onResourceCreated={handleResourceCreated}
        onPurchaseResource={openPayment}
      />
      <PaymentModal
        resource={paymentResourceId ? getResourceById(resourceList, paymentResourceId) : null}
        mode={mode}
        onModeChange={toggleMode}
        onClose={() => setPaymentResourceId(null)}
        onConfirm={confirmPayment}
      />
      <footer className="site-footer">
        <span>stripe3 / x402 payment gateway for Solana resources</span>
        <span>Need Solana funds? Fund through LI.FI in production.</span>
      </footer>
    </Layout>
  );
}

export default App;
