// Anti-caching Service Worker for Development
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Don't cache API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }).catch(error => {
        console.error('Fetch error:', error);
        return new Response(JSON.stringify({ error: 'Network error' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }
  
  // For non-API requests, use network-first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(error => {
        console.error('Fetch error:', error);
        return caches.match(event.request);
      })
  );
});