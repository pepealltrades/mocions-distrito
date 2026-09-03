const CACHE="mocions-66d339b7";
const FITXERS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];

/* En instal·lar, baixem els fitxers amb {cache:"reload"} per saltar-nos la
   memòria del navegador. Amb addAll() a seques, el navegador podia servir la
   còpia antiga que ja tenia i la desàvem sota el nom de la versió NOVA: la
   caixa deia "actualitzada" i dins hi havia el programa vell, i llavors ja no
   s'actualitzava mai més. (Detectat el 03-09-2026 en publicar.) */
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(FITXERS.map(function(u){
      return fetch(u,{cache:"reload"}).then(function(r){
        if(!r.ok) throw new Error("no s'ha pogut baixar "+u);
        return c.put(u,r);
      });
    }));
  }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){ return self.clients.claim(); }));
});

/* Primer la caixa (així funciona sense connexió), però demanem la versió nova
   pel darrere i la desem per a la pròxima obertura. */
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET") return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){
    const xarxa=fetch(e.request).then(function(resp){
      if(resp && resp.ok && e.request.url.startsWith(self.registration.scope)){
        const copia=resp.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request,copia); });
      }
      return resp;
    }).catch(function(){ return r; });
    return r || xarxa;
  }));
});
