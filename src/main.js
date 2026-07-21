/* src/main.js - Application Entry Point */

import './styles/tokens.css';
import './styles/themes.css';
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/responsive.css';

import { initApp } from './app.js';

// Register PWA Service Worker in production / supported browser
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('[Stockpick PWA] Service worker registered:', reg.scope);
    }).catch(err => {
      console.warn('[Stockpick PWA] Service worker registration failed:', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root) {
    initApp(root);
  }
});
