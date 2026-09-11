/* sw.js — 最小オフライン対応。初回はネットワーク優先、2回目からCacheFirst */
const CACHE = 'honshitsu-v1';
const CORE = [
  './',
  './index.html',
  './css/vn.css',
  './js/main.js',
  './js/game.js',
  './js/shell.js',
  './js/visual.js',
  './js/audio.js',
  './js/store.js',
  './js/state.js',
  './js/parser.js',
  './js/text.js',
  './data/meta.json',
  './data/terms.json',
  './data/assets.json',
  './data/script/index.txt',
  './assets/bg/title_key.jpg',
  './manifest.json'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(CORE)).then(()=> self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=> k!==CACHE).map(k=> caches.delete(k)))).then(()=> self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  // data/script/*.txt と assets は CacheFirst、他は NetworkFirst
  const isAsset = url.pathname.includes('/assets/') || url.pathname.includes('/data/script/');
  if(isAsset){
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=> c.put(e.request, copy));
      return res;
    })));
  } else {
    e.respondWith(fetch(e.request).catch(()=> caches.match(e.request)));
  }
});
