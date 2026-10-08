const CACHE = '7mow-v1';
const D = '7%20Minutes%20of%20Hell%20-%20The%20Scientific%207-Minute-Workout%20Timer_files/';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  D + 'main.css', D + 'css.css', D + 'main.js', D + 'jquery.js', D + 'timer.jpg',
  D + 'beep-7.wav', D + 'beep-7.mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))
  );
});
