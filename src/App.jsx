import { useEffect, useMemo, useRef, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Layout } from "./components/layout/Layout";
import { CookieConsent } from "./components/layout/CookieConsent";
import { PaymentModal } from "./components/checkout/PaymentModal";
import { UnlockedContentModal } from "./components/checkout/UnlockedContentModal";
import { TakeDownResourceModal } from "./components/resources/TakeDownResourceModal";
import { ResourceIntegrationModal } from "./components/resources/ResourceIntegrationModal";
import { WalletGate } from "./components/layout/WalletGate";
import { resources as seededResources } from "./lib/data";
import { fetchResources, takeDownResource } from "./lib/gatewayClient";
import { createStripe3Connection } from "./lib/networks";
import { setProductActive } from "./lib/stripe3Program";
import { getResourceById } from "./lib/utils";
import { Landing } from "./pages/Landing";
import { Resources } from "./pages/Resources";
import { Funding } from "./pages/Funding";
import { AgentMode } from "./pages/AgentMode";
import { Receipts } from "./pages/Receipts";

const pageMap = {
  landing: Landing,
  resources: Resources,
  funding: Funding,
  agent: AgentMode,
  receipts: Receipts,
};

function App({ mode, setMode }) {
  const wallet = useAnchorWallet();
  const walletConnected = Boolean(wallet?.publicKey);
  const [activePage, setActivePage] = useState("landing");
  const [resourceList, setResourceList] = useState(seededResources);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState(seededResources[0]?.id || "");
  const [paymentResourceId, setPaymentResourceId] = useState(null);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showUnlockedContent, setShowUnlockedContent] = useState(false);
  const [integrationResource, setIntegrationResource] = useState(null);
  const [takeDownCandidate, setTakeDownCandidate] = useState(null);
  const [takingDownResourceId, setTakingDownResourceId] = useState("");
  const unlockTimerRef = useRef(null);
  const connection = useMemo(() => createStripe3Connection(mode), [mode]);

  const selectedResource = useMemo(
    () => getResourceById(resourceList, selectedResourceId),
    [resourceList, selectedResourceId],
  );

  const Page = pageMap[activePage] || Landing;
  const pageLocked = activePage !== "landing" && !walletConnected;

  useEffect(() => {
    let active = true;

    async function loadResources() {
      try {
        setResourcesLoading(true);
        const nextResources = await fetchResources(mode);

        if (!active) return;
        setResourceList(nextResources);
        setSelectedResourceId((current) => (
          nextResources.some((resource) => resource.id === current)
            ? current
            : nextResources[0]?.id || ""
        ));
        setResourcesError("");
      } catch (error) {
        if (active) setResourcesError(error.message || "Gateway is not reachable.");
      } finally {
        if (active) setResourcesLoading(false);
      }
    }

    if (!walletConnected || activePage !== "resources") return undefined;

    loadResources();
    return () => {
      active = false;
    };
  }, [mode, walletConnected, activePage]);

  useEffect(() => () => {
    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
  }, []);

  function openPayment(resourceId) {
    setSelectedResourceId(resourceId);
    setPaymentResourceId(resourceId);
  }

  function toggleMode() {
    setMode((current) => (current === "devnet" ? "production" : "devnet"));
  }

  function confirmPayment(result) {
    const paidResource = getResourceById(resourceList, paymentResourceId || selectedResourceId);

    setPaymentResourceId(null);
    setPaymentResult({ ...result, resource: paidResource });
    setPaymentStarted(true);
    setShowUnlockedContent(false);
    setActivePage("agent");

    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = window.setTimeout(() => {
      setShowUnlockedContent(true);
    }, 5600);
  }

  function handleResourceCreated(resource) {
    setResourceList((current) => [
      resource,
      ...current.filter((item) => item.id !== resource.id),
    ]);
    setSelectedResourceId(resource.id);
  }

  function handleTakeDownResource(resource) {
    setResourcesError("");

    if (!wallet?.publicKey) {
      setResourcesError("Connect the seller wallet before taking down a listing.");
      return;
    }

    if (wallet.publicKey.toBase58() !== resource.merchant) {
      setResourcesError("Only the seller wallet can take down this listing.");
      return;
    }

    setTakeDownCandidate(resource);
  }

  async function confirmTakeDownResource() {
    if (!takeDownCandidate) return;

    try {
      const resource = takeDownCandidate;
      setTakingDownResourceId(resource.id);
      await setProductActive({ connection, wallet, resource, active: false });
      await takeDownResource(resource);

      const nextResources = resourceList.filter((item) => item.id !== resource.id);
      setResourceList(nextResources);

      if (selectedResourceId === resource.id) {
        setSelectedResourceId(nextResources[0]?.id || "");
      }
      setTakeDownCandidate(null);
    } catch (error) {
      setResourcesError(error.message || "Unable to take down listing.");
    } finally {
      setTakingDownResourceId("");
    }
  }

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      mode={mode}
      onModeChange={toggleMode}
    >
      {pageLocked ? (
        <WalletGate />
      ) : (
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
          onViewIntegration={setIntegrationResource}
          onTakeDownResource={handleTakeDownResource}
          takingDownResourceId={takingDownResourceId}
        />
      )}
      <PaymentModal
        resource={walletConnected && paymentResourceId ? getResourceById(resourceList, paymentResourceId) : null}
        mode={mode}
        onClose={() => setPaymentResourceId(null)}
        onConfirm={confirmPayment}
      />
      <TakeDownResourceModal
        resource={walletConnected ? takeDownCandidate : null}
        busy={Boolean(takingDownResourceId)}
        onCancel={() => setTakeDownCandidate(null)}
        onConfirm={confirmTakeDownResource}
      />
      <ResourceIntegrationModal
        resource={walletConnected ? integrationResource : null}
        onClose={() => setIntegrationResource(null)}
      />
      {walletConnected && showUnlockedContent && (
        <UnlockedContentModal
          paymentResult={paymentResult}
          resource={paymentResult?.resource || selectedResource}
          onClose={() => setShowUnlockedContent(false)}
        />
      )}
      <footer className="site-footer">
        <span>stripe3 / x402 payment gateway for Solana resources</span>
        <span>Need Solana funds? Fund through LI.FI in production.</span>
      </footer>
      <CookieConsent />
    </Layout>
  );
}

export default App;
