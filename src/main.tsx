import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker with GitHub Pages relative path resolution
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    // Relative to the current document URL for GitHub Pages support
    const swUrl = new URL('sw.js', window.location.href).href;
    navigator.serviceWorker.register(swUrl).then(
      (registration) => {
        console.log('TWC CareCRM Service Worker registered at:', registration.scope);
      },
      (err) => {
        console.log('Service Worker registration failed:', err);
      }
    );
  });
}

createRoot(document.getElementById('root')!).render(<App />);
