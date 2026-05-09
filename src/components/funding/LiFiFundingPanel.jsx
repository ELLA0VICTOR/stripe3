import { lazy, Suspense } from "react";

const LiFiWidget = lazy(() =>
  import("@lifi/widget").then((module) => ({ default: module.LiFiWidget })),
);

export function LiFiFundingPanel({ className = "" }) {
  return (
    <div className={`lifi-widget-shell ${className}`}>
      <Suspense fallback={<div className="panel-copy">Loading LI.FI routes...</div>}>
        <LiFiWidget
          integrator="stripe3"
          config={{
            appearance: "dark",
            variant: "compact",
            theme: {
              container: {
                border: "1px solid rgba(255, 255, 255, 0.18)",
                borderRadius: "0px",
                boxShadow: "none",
              },
              palette: {
                primary: { main: "#3399ff" },
                background: { paper: "#030303", default: "#030303" },
              },
            },
          }}
        />
      </Suspense>
    </div>
  );
}
