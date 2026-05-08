import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'
import '@solana/wallet-adapter-react-ui/styles.css'
import './index.css'
import App from './App.jsx'
import { SolanaProvider } from './components/solana/SolanaProvider.jsx'

globalThis.Buffer ||= Buffer

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </StrictMode>,
)
