// Service Worker for offline support

const CACHE_NAME = 'find-the-flag-v1';
const IMAGE_CACHE_NAME = 'find-the-flag-images-v1';
const urlsToCache = [
  '/find-the-flag/',
  '/find-the-flag/index.html',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
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
  
  // For Vite-generated assets (JS, CSS) and same-origin requests, use cache-first with network fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request).then((networkResponse) => {
          // Cache Vite assets (JS, CSS, fonts, images from assets folder)
          if (networkResponse && networkResponse.status === 200 &&
              (event.request.url.includes('/assets/') || 
               event.request.destination === 'script' || 
               event.request.destination === 'style')) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        }).catch((error) => {
          // Handle fetch errors for offline scenarios
          console.error('Fetch failed:', error);
          // Return a basic offline page if available in cache
          return caches.match('/find-the-flag/index.html');
        });
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

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
