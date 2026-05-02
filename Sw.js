// SW version 20 — auto-update + update banner
console.log("SW version 20");

const CACHE_NAME = "roundness-cache-v20";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./css/index.css",
  "./js/index.js",
  "./Manifest.json",
  "./icon-192-v2.png",
  "./icon-512-v2.png"
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
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );

      await self.clients.claim();

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
