// Service Worker for offline support

const CACHE_NAME = 'find-the-flag-v4';
const IMAGE_CACHE_NAME = 'find-the-flag-images-v4';

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    self.skipWaiting()
  );
});

// Fetch event - serve from cache when possible, cache Wikipedia images and Vite assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache Wikipedia flag images
  if (url.hostname === 'upload.wikimedia.org') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return a fallback or offline message if fetch fails
            return new Response('Offline - Image not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
        });
      })
    );
    return;
  }
  
  // For same-origin requests, use network-first strategy for HTML, stale-while-revalidate for assets
  if (url.origin === self.location.origin) {
    // Always fetch HTML from network to ensure latest version
    if (event.request.mode === 'navigate' || event.request.destination === 'document') {
      event.respondWith(
        fetch(event.request).catch(() => {
          return caches.match('/find-the-flag/index.html');
        })
      );
      return;
    }
    
    // For assets (JS, CSS, fonts, images), use stale-while-revalidate
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Cache Vite assets (JS, CSS, fonts, images from assets folder)
          if (networkResponse && networkResponse.status === 200 &&
              (event.request.url.includes('/assets/') || 
               event.request.destination === 'script' || 
               event.request.destination === 'style' ||
               event.request.destination === 'font' ||
               event.request.destination === 'image')) {
            caches.open(CACHE_NAME).then((cache) => {
              return cache.put(event.request, networkResponse.clone());
            }).catch((error) => {
              console.error('Failed to update cache for', event.request.url, error);
            });
          }
          return networkResponse;
        }).catch((error) => {
          // If network fails and we have a cached response, use it
          if (cachedResponse) {
            return cachedResponse;
          }
          console.error('Fetch failed and no cache available:', error);
          throw error;
        });
        
        // Return cached response immediately if available, but still fetch in background
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
  
  // For other requests (external resources), use network-first strategy
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Activate event - cleanup old caches and take control of clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }).filter(Boolean)
      );
    }).then(() => {
      // Immediately claim all clients so the new service worker takes control
      return self.clients.claim();
    })
  );
});

// Message event - handle skip waiting command from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
