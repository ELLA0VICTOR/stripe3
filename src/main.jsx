import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'
import '@solana/wallet-adapter-react-ui/styles.css'
import './index.css'
import { Root } from './Root.jsx'

globalThis.Buffer ||= Buffer

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
