import { useState } from "react";
import { PaymentRequiredPanel } from "../components/checkout/PaymentRequiredPanel";
import { InvoiceCard } from "../components/checkout/InvoiceCard";
import { LifiFundingPanel } from "../components/checkout/LifiFundingPanel";
import { ReceiptPanel } from "../components/checkout/ReceiptPanel";

export function Checkout({ resource, mode, onModeChange }) {
  const [paid, setPaid] = useState(false);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            Protected resource
          </div>
          <h1 className="page-title">Unlock a paid resource.</h1>
          <p className="page-copy">
            Pay the invoice, verify the Solana receipt, then access the protected endpoint.
          </p>
        </div>
      </header>

      <section className="section-grid">
        <div className="grid gap-6">
          <PaymentRequiredPanel resource={resource} onPay={() => setPaid(true)} />
          <ReceiptPanel paid={paid} />
        </div>
        <div className="grid gap-6">
          <InvoiceCard resource={resource} mode={mode} />
          <LifiFundingPanel mode={mode} onModeChange={onModeChange} />
        </div>
      </section>
    </div>
  );
}
