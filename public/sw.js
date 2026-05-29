// Self-destroying service worker to instantly release users from legacy caches
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log('🗑️ Force deleting cache store:', key);
          return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// No fetch intercept listeners are registered. All requests bypass to real network directly.
