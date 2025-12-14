import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { t } from './i18n'
import type { Language } from './types'
import { ErrorBoundary } from './components/ErrorBoundary'

// App version for cache busting
export const APP_VERSION = '0.4.1';

if (import.meta.env.DEV) {
  console.log('[Find the Flag] Starting application...');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[Find the Flag] Root element not found!');
  throw new Error('Root element #root not found');
}

if (import.meta.env.DEV) {
  console.log('[Find the Flag] Root element found, creating React root...');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

if (import.meta.env.DEV) {
  console.log('[Find the Flag] React app rendered successfully');
}

// Register service worker for PWA support with update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.DEV) {
      console.log('[Find the Flag] Registering service worker...');
    }
    // Add version parameter to force browser to check for SW updates
    // This prevents browsers from caching old service worker files
    navigator.serviceWorker.register(`/find-the-flag/sw.js?v=${APP_VERSION}`)
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log('[Find the Flag] Service worker registered successfully');
        }
        
        // Check for updates periodically (every 60 seconds)
        const updateIntervalId = setInterval(() => {
          registration.update();
        }, 60000);

        // Clear the interval when the page is unloaded (use 'pagehide' for reliability)
        window.addEventListener('pagehide', () => {
          clearInterval(updateIntervalId);
        });
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, notify user
                showUpdateNotification(newWorker);
              }
            }, { once: true });
          }
        });
      })
      .catch((error) => {
        console.error('[Find the Flag] Service worker registration failed:', error);
        // Don't throw - service worker is not critical for app functionality
      });
  });
}

function showUpdateNotification(worker: ServiceWorker) {
  // Check if notification already exists to prevent duplicates
  const existingNotification = document.querySelector('.update-notification');
  if (existingNotification) {
    return; // Don't create duplicate notifications
  }

  // Detect language from localStorage (same as LanguageContext)
  const storedLanguage = localStorage.getItem('find-the-flag-language') as Language | null;
  const language: Language = storedLanguage || 'en';
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.setAttribute('role', 'status');
  notification.setAttribute('aria-live', 'polite');

  // Create content container
  const content = document.createElement('div');
  content.className = 'update-notification-content';

  // Create message paragraph
  const messageP = document.createElement('p');
  messageP.className = 'update-notification-text';
  messageP.textContent = t('update.available', language);

  // Create update button
  const updateBtn = document.createElement('button');
  updateBtn.className = 'btn btn-primary btn-small update-btn';
  updateBtn.type = 'button';
  updateBtn.textContent = t('update.reload', language);

  // Assemble elements
  content.appendChild(messageP);
  content.appendChild(updateBtn);
  notification.appendChild(content);

  document.body.appendChild(notification);

  // Handle update button click with cleanup
  const handleUpdateClick = () => {
    // Remove the click listener to prevent memory leaks
    updateBtn.removeEventListener('click', handleUpdateClick);
    
    worker.postMessage({ type: 'SKIP_WAITING' });
    // Reload the page when the new service worker takes control
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
  };
  
  updateBtn.addEventListener('click', handleUpdateClick);
}

