const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Активировать сразу
  );
});

self.addEventListener('activate', (event) => {
  // Удаляем старые кэши
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Берём контроль над страницами сразу
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кэш, если есть
        if (response) {
          return response;
        }
        // Иначе делаем запрос
        return fetch(event.request)
          .then((networkResponse) => {
            // Не все ресурсы можно кэшировать (напр. POST), поэтому проверяем
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Кэшируем ответ для будущего использования
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
            return networkResponse;
          });
      })
  );
});