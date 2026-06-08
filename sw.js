const CACHE_NAME = "triviugh-v28";
const COVER_ASSETS = [
  "./assets/cover/trivi-ugh-update-v1.png"
];
const LOGO_ASSETS = [
  "./assets/logos/accuweather.svg",
  "./assets/logos/adidas.svg",
  "./assets/logos/airbnb.svg",
  "./assets/logos/applepodcasts.svg",
  "./assets/logos/audi.svg",
  "./assets/logos/bankofamerica.svg",
  "./assets/logos/doordash.svg",
  "./assets/logos/ferrari.svg",
  "./assets/logos/fortnite.svg",
  "./assets/logos/mcdonalds.svg",
  "./assets/logos/netflix.svg",
  "./assets/logos/newbalance.svg",
  "./assets/logos/newyorktimes.svg",
  "./assets/logos/nike.svg",
  "./assets/logos/paramountplus.svg",
  "./assets/logos/playstation.svg",
  "./assets/logos/quizlet.svg",
  "./assets/logos/shazam.svg",
  "./assets/logos/soundcloud.svg",
  "./assets/logos/spotify.svg",
  "./assets/logos/starbucks.svg",
  "./assets/logos/tacobell.svg",
  "./assets/logos/tesla.svg",
  "./assets/logos/ubisoft.svg",
  "./assets/logos/youtube.svg"
];
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/triviugh-icon.svg",
  ...COVER_ASSETS,
  ...LOGO_ASSETS
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
