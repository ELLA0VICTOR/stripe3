import { useState } from "react";
import App from "./App.jsx";
import { SolanaProvider } from "./components/solana/SolanaProvider.jsx";

export function Root() {
  const [mode, setMode] = useState("devnet");

  return (
    <SolanaProvider mode={mode}>
      <App mode={mode} setMode={setMode} />
    </SolanaProvider>
  );
}
