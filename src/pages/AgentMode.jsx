import { useEffect, useState } from "react";
import { AgentConsole } from "../components/agent/AgentConsole";
import { AgentLog } from "../components/agent/AgentLog";
import { EmptyNotice } from "../components/ui/EmptyNotice";

export function AgentMode({ resource, mode, paymentStarted, paymentResult }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!paymentStarted) return undefined;

    const timers = [0, 700, 1600, 2700, 3900, 5200].map((delay, index) => (
      window.setTimeout(() => setActiveStep(index), delay)
    ));

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [paymentStarted, paymentResult?.receipt, paymentResult?.signature]);

  if (!paymentStarted) {
    return (
      <div className="page-stack">
        <header className="page-header">
          <div>
            <div className="page-kicker">
              <span className="dot" />
              Payment activity
            </div>
            <h1 className="page-title">No active payment yet.</h1>
            <p className="page-copy">
              Choose a resource first, then confirm payment to start the x402 activity log.
            </p>
          </div>
        </header>

        <EmptyNotice
          title="No active payments"
          copy="Purchase a resource to start an x402 payment session."
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <div className="page-kicker">
            <span className="dot" />
            x402 verification
          </div>
          <h1 className="page-title">Payment activity.</h1>
          <p className="page-copy">
            Live receipt verification and access unlock for the current resource.
          </p>
        </div>
      </header>

      <section className="activity-grid">
        <AgentConsole
          resource={resource}
          mode={mode}
          paymentResult={paymentResult}
          activeStep={activeStep}
        />
        <AgentLog resource={resource} paymentResult={paymentResult} activeStep={activeStep} />
      </section>
    </div>
  );
}
