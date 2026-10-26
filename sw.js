// ============================================================
// EL PASTILLERO — Service Worker (sw.js)
// Permite uso OFFLINE completo (PWA)
// ============================================================

const CACHE_NAME = 'pastillero-v1.2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './layout.css',
  './app.js',
  './manifest.json'
];

// Instalar: cachear todos los assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activar: limpiar caches anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first para assets locales, Network-first para externos
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Para CDN externas (XLSX, fonts): network-first con fallback
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Para assets locales: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
