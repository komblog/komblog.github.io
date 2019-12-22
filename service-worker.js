importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '2' },
  { url: '/nav.html', revision: '1' },
  { url: '/manifest.json', revision: '1'},
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/materialize.js', revision: '1' },
  { url: '/js/nav.js', revision: '2' },
  { url: '/js/api.js', revision: '2' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/startup.js', revision: '2' },
  { url: '/img/icon-72x72.png', revision: '1' },
  { url: '/img/icon-96x96.png', revision: '1' },
  { url: '/img/icon-128x128.png', revision: '1' },
  { url: '/img/icon-192x192.png', revision: '1' },
  { url: '/img/icon-384x384.png', revision: '1' },
  { url: '/img/icon-512x512.png', revision: '1' },
  { url: '/Pages/favorite.html', revision: '1' }
]);

workbox.routing.registerRoute(
  new RegExp('/Pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-lovers'
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-lovers-api',
    plugins : [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 5 * 60,
      }),
    ],
  })
);

self.addEventListener('push', function(event) {
  var body;

  if(event.data) {
      body = event.data.text();
  } else {
      body = "Push message no payload";
  }

  var options = {
      body : body,
      vibrate: [100, 50, 100],
      data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
      }
  };

  event.waitUntil(
      self.registration.showNotification('Push Notification', options) 
  );
});