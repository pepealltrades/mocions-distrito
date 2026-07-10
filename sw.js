const CACHE="mocions-310cbd23";
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"]);
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch",function(e){
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){ return r||fetch(e.request); }));
});
