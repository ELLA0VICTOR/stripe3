import { useMemo, useState } from "react";
import { Layout } from "./components/layout/Layout";
import { PaymentModal } from "./components/checkout/PaymentModal";
import { resources } from "./lib/data";
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
  const [selectedResourceId, setSelectedResourceId] = useState(resources[0].id);
  const [paymentResourceId, setPaymentResourceId] = useState(null);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const selectedResource = useMemo(
    () => getResourceById(resources, selectedResourceId),
    [selectedResourceId],
  );

  const Page = pageMap[activePage] || Landing;

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
        onPurchaseResource={openPayment}
      />
      <PaymentModal
        resource={paymentResourceId ? getResourceById(resources, paymentResourceId) : null}
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
