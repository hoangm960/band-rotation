import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Handle GitHub Pages SPA redirect
if (window.location.search.startsWith('?/')) {
  const path = window.location.search.slice(2); // Remove '?/'
  window.history.replaceState(null, '', path);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
