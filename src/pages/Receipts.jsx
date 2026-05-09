import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchReceiptsForBuyer } from "../lib/gatewayClient";
import { formatAddress, formatLamports, getSolanaExplorerUrl } from "../lib/utils";
import { Badge, Button, DataLine, Panel } from "../components/ui";
import { EmptyNotice } from "../components/ui/EmptyNotice";

export function Receipts({ mode = "devnet" }) {
  const { publicKey } = useWallet();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const buyer = publicKey?.toBase58();

  async function loadReceipts() {
    setError("");

    if (!buyer) {
      setReceipts([]);
      return;
    }

    try {
      setLoading(true);
      setReceipts(await fetchReceiptsForBuyer(buyer, mode));
    } catch (receiptError) {
      setError(receiptError.message || "Unable to load receipts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!buyer) return;

    let ignore = false;

    fetchReceiptsForBuyer(buyer, mode)
      .then((data) => {
        if (!ignore) setReceipts(data);
      })
      .catch((receiptError) => {
        if (!ignore) setError(receiptError.message || "Unable to load receipts.");
      });

    return () => {
      ignore = true;
    };
  }, [buyer, mode]);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Onchain proof
          </div>
          <h1 className="page-title">Access receipts.</h1>
          <p className="page-copy">
            Receipts are fetched from Solana PDA accounts for the connected wallet.
          </p>
        </div>
        <Button variant="secondary" onClick={loadReceipts} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </header>

      {!buyer && (
        <EmptyNotice
          title="No wallet connected"
          copy="Connect a wallet to view verified receipts."
        />
      )}

      {error && <div className="modal-error">{error}</div>}

      {buyer && !loading && receipts.length === 0 && (
        <EmptyNotice
          title="No receipts yet"
          copy="Verified access proofs will appear here after payment."
        />
      )}

      <section className="grid gap-6">
        {receipts.map((receipt) => (
          <Panel key={receipt.pda}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge tone="green">Verified</Badge>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-text-primary">{receipt.resource}</h3>
              </div>
              <div className="text-right text-xl font-black text-text-primary">{formatLamports(receipt.amountLamports)}</div>
            </div>
            <div className="data-list mt-5">
              <DataLine label="Buyer" value={formatAddress(receipt.buyer)} />
              <DataLine label="Receipt PDA" value={receipt.pda} />
              <DataLine label="Source" value={receipt.source || "solana"} />
            </div>
            <div className="proof-actions">
              <a
                className="proof-link"
                href={getSolanaExplorerUrl(receipt.pda, receipt.network)}
                target="_blank"
                rel="noreferrer"
              >
                View receipt
              </a>
              <button
                className="proof-link"
                type="button"
                onClick={() => navigator.clipboard?.writeText(receipt.pda)}
              >
                Copy PDA
              </button>
            </div>
          </Panel>
        ))}
      </section>
    </div>
  );
}
