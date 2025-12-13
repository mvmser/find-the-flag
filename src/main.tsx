import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { t } from './i18n'
import type { Language } from './types'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker for PWA support with update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/find-the-flag/sw.js')
      .then((registration) => {
        // Service worker registered successfully
        
        // Check for updates periodically (every 60 seconds)
        const updateIntervalId = setInterval(() => {
          registration.update();
        }, 60000);

        // Clear the interval when the page is unloaded
        window.addEventListener('unload', () => {
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
      .catch(() => {
        // Service worker registration failed
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
  const storedLanguage = localStorage.getItem('language') as Language | null;
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

  // Handle update button click
  updateBtn.addEventListener('click', () => {
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
  });
}

