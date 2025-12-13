import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

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
            });
          }
        });
      })
      .catch(() => {
        // Service worker registration failed
      });
  });
}

function showUpdateNotification(worker: ServiceWorker) {
  // Detect language from localStorage (same as LanguageContext)
  const storedLanguage = localStorage.getItem('language') as 'en' | 'fr' | null;
  const language = storedLanguage || 'en';
  
  // Bilingual notification texts
  const texts = {
    en: {
      message: 'A new version is available!',
      button: 'Update Now'
    },
    fr: {
      message: 'Une nouvelle version est disponible!',
      button: 'Mettre à jour'
    }
  };
  
  const text = texts[language];
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <div class="update-notification-content">
      <p class="update-notification-text">${text.message}</p>
      <button class="btn btn-primary btn-small update-btn">${text.button}</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Handle update button click
  const updateBtn = notification.querySelector('.update-btn');
  updateBtn?.addEventListener('click', () => {
    worker.postMessage({ type: 'SKIP_WAITING' });
    
    // Reload the page when the new service worker takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

