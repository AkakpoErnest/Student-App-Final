import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfill for crypto.randomUUID
if (!crypto.randomUUID) {
  (crypto as any).randomUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

// Polyfill for Buffer
if (typeof window !== 'undefined' && !(window as any).Buffer) {
  (window as any).Buffer = {
    isBuffer: () => false,
    alloc: () => new Uint8Array(),
    from: () => new Uint8Array()
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
