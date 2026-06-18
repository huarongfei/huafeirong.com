const CACHE_NAME = 'hfr-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/ecs.html',
  '/studio.html',
  '/portfolio.html',
  '/blog/',
  '/blog/huafeirong-native-architecture.html',
  '/blog/scoring-algorithm.html',
  '/blog/dotnet-maui-cross-platform.html',
  '/search.html',
  '/status.html',
  '/404.html',
  '/css/style.css',
  '/css/blog.css',
  '/js/main.js',
  '/assets/favicon.svg',
  '/assets/og-image.svg',
  '/manifest.json',
  '/contact.html',
  '/privacy.html',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png'
];

// Install: pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Update found: 新版本已下载，通知所有客户端
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for static assets, network-first for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (url.origin !== self.location.origin || request.method !== 'GET') return;

  const isHTML = request.headers.get('Accept')?.includes('text/html') ||
                 url.pathname.endsWith('.html') ||
                 url.pathname.endsWith('/');
  const isStatic = /\.(css|js|svg|png|jpe?g|gif|webp|avif|ico|woff2?|json|xml|txt|md)$/.test(url.pathname);

  if (isHTML) {
    // Network-first for HTML (fresh content)
    event.respondWith(
      fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      }).catch(() => {
        return caches.match(request);
      })
    );
  } else if (isStatic) {
    // Cache-first for static assets
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
  }
});
