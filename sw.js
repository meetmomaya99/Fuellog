// FuelLog Service Worker
// Caches the app shell so it loads instantly and works fully offline.
// Update CACHE_VERSION whenever you deploy a new version of the app —
// this forces users to get the latest files.

const CACHE_VERSION = 'fuellog-v2';

const CORE_FILES = [
  '/',
  '/index.html',
  '/manifest.json'
];

// ── Install ────────────────────────────────────────────────────────
// Pre-cache the core files so the app is available offline immediately.
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      console.log('[SW] Pre-caching core files');
      return cache.addAll(CORE_FILES);
    }).then(function() {
      // Skip waiting so the new SW activates immediately
      return self.skipWaiting();
    })
  );
});

// ── Activate ───────────────────────────────────────────────────────
// Delete any old caches from previous versions.
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) { return name !== CACHE_VERSION; })
          .map(function(name) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(function() {
      // Take control of all open pages immediately
      return self.clients.claim();
    })
  );
});

// ── Fetch ──────────────────────────────────────────────────────────
// Strategy: Cache-first for the app shell, network-first for everything else.
// Since FuelLog is a single HTML file with no external API calls,
// we serve from cache and fall back to network.
self.addEventListener('fetch', function(event) {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (ads, analytics, etc. in future)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        // Serve from cache, then update cache in background (stale-while-revalidate)
        const fetchPromise = fetch(event.request).then(function(networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_VERSION).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(function() {
          // Network failed — that's fine, we already served from cache
        });

        return cachedResponse;
      }

      // Not in cache — fetch from network and cache the result
      return fetch(event.request).then(function(networkResponse) {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(CACHE_VERSION).then(function(cache) {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      }).catch(function() {
        // Both cache and network failed — return a simple offline message
        // for navigation requests (page loads)
        if (event.request.mode === 'navigate') {
          return caches.match('/') || new Response(
            '<h1>You are offline</h1><p>Open FuelLog while connected once to enable offline access.</p>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
      });
    })
  );
});

// ── Background sync (future use) ───────────────────────────────────
// When cloud sync is added, use this to retry failed syncs when
// the user comes back online.
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
    // Future: sync localStorage data to server
  }
});
