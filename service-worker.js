"use strict"

self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v1'];

  console.debug("Running clean up..")
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.debug("Removed old cache "+key)
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
          return caches.open('v1').then(function(cache) {
            console.debug("Saved to cache " + event.request.url)
            cache.put(event.request, response.clone());
            return response;
          });
        });
    })
  );
});

self.addEventListener('install', event => {
  console.debug('install event.')
})