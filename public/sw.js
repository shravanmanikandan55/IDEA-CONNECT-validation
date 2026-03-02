const CACHE_NAME = 'ideaconnect-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Bypass cache for API requests and non-GET requests
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return; // Let the browser handle the request normally
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      // Fallback for offline if fetch fails
      return fetch(event.request);
    })
  );
});
