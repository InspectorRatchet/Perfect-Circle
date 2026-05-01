// SW version 4 — auto-update + update banner
console.log("SW version 3");

const CACHE_NAME = "roundness-cache";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install — cache static assets and activate immediately
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches + notify clients new version is ready
self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      // Delete old caches
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );

      // Take control immediately
      await self.clients.claim();

      // Notify all open windows that a new version is ready
      const clientsList = await self.clients.matchAll({ type: "window" });
      for (const client of clientsList) {
        client.postMessage({ type: "NEW_VERSION_READY" });
      }
    })()
  );
});

// Fetch — network-first for HTML/JS/CSS, cache-first for everything else
self.addEventListener("fetch", event => {
  const request = event.request;

  // Network-first for app shell files
  if (
    request.url.endsWith(".html") ||
    request.url.endsWith(".js") ||
    request.url.endsWith(".css")
  ) {
    event.respondWith(
      fetch(request)
        .then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(request).then(cached => {
      return (
        cached ||
        fetch(request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        })
      );
    })
  );
});
