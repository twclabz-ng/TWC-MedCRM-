import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker with resilient scope and lifecycle handling
if ('serviceWorker' in navigator) {
  const registerServiceWorker = () => {
    // Relative to the current document URL for GitHub Pages and Cloud Run support
    const swUrl = new URL('sw.js', window.location.href).href;
    navigator.serviceWorker
      .register(swUrl, { scope: './' })
      .then((registration) => {
        console.log('TWC CareCRM Service Worker registered at:', registration.scope);
      })
      .catch((err) => {
        console.warn('Service Worker registration note:', err);
      });
  };

  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
}

createRoot(document.getElementById('root')!).render(<App />);
