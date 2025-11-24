const CACHE_NAME = 'smart-watch-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE)
          .then(() => self.skipWaiting());
      })
      .catch(err => console.error('Кэширование не удалось:', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return event.respondWith(fetch(request));
  }

  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
      .then((response) => {
        if (response) {
          return response;
        }
        throw new Error('Ресурс не найден ни в сети, ни в кэше');
      })
  );
});
