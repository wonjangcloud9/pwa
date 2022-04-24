const staticAssets = [
  "./",
  "./style.css",
  "./index.js",
  "./sounds/sounds_bubbles.mp3",
  "./sounds/sounds_clay.mp3",
  "./sounds/sounds_confetti.mp3",
  "./sounds/sounds_glimmer.mp3",
  "./sounds/sounds_moon.mp3",
  "./sounds/sounds_ufo.mp3",
];

self.addEventListener("install", async (event) => {
  const cache = await caches.open("static-cache");
  cache.addAll(staticAssets);
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.url) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(newtorkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = caches.match(req);
  return cachedResponse || fetch(req);
}

async function newtorkFirst(req) {
  const cache = await caches.open("dynamic-cache");

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}
