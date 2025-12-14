// Service Worker for offline support

const CACHE_NAME = 'find-the-flag-v4';
const IMAGE_CACHE_NAME = 'find-the-flag-images-v4';

// Install event - cache essential HTML for offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.add('/find-the-flag/index.html'))
      .then(() => self.skipWaiting())
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
          // Try to serve cached index.html as fallback
          return caches.match('/find-the-flag/index.html').then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If no cache available, return a basic offline page
            return new Response(
              '<!DOCTYPE html><html><head><title>Offline / Hors ligne</title></head><body><h1>Offline / Hors ligne</h1><p>Please check your internet connection and try again.<br>Veuillez vérifier votre connexion Internet et réessayer.</p></body></html>',
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/html'
                })
              }
            );
          });
        })
      );
      return;
    }
    
    // For assets (JS, CSS, fonts, images), use stale-while-revalidate
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Start fetching from network regardless of cache status
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Cache Vite assets (JS, CSS, fonts, images from assets folder)
          if (networkResponse && networkResponse.status === 200 &&
              (event.request.url.includes('/assets/') || 
               event.request.destination === 'script' || 
               event.request.destination === 'style' ||
               event.request.destination === 'font' ||
               event.request.destination === 'image')) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            }).catch((error) => {
              console.error('Failed to update cache for', event.request.url, error);
            });
          }
          return networkResponse;
        }).catch((error) => {
          // Network fetch failed
          console.error('Fetch failed for', event.request.url, error);
          // If we have a cached response, it's already being returned
          // If we don't, re-throw the error
          if (!cachedResponse) {
            throw error;
          }
          // Return undefined to indicate failure when cached response exists
          // (the cached response is already returned on line 118)
          return undefined;
        });
        
        // Stale-while-revalidate: return cached response immediately if available,
        // otherwise wait for network fetch
        if (cachedResponse) {
          // Return cached response immediately, fetchPromise updates cache in background
          return cachedResponse;
        }
        // No cached response, wait for network
        return fetchPromise;
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
