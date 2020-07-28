// disable eslint rule so that we can use `self` in the service worker
/* eslint-disable no-restricted-globals */

const PRE_CACHE = "pre_cache-v1";
const HN_STORIES = "hackernews-stories-v1";

/*
 * TODO add the ability to cache the generated/hashes files.
 * easier done with a framework. This is a naieve solution.
 * None of the hashed files (JS, CSS) will be cached. This is considered out
 * of scope for this exercise
 */
const PRE_CACHE_URLS = [
  "./",
  "./index.html",
  "./favicon.ico",
  "./logo192.png",
  "./logo512.png",
  "./manifest.json",
];

/*
 * On install we cache the items we always want to cache (static assets).
 * When we change these, we need to update the version of the cache
 */
self.addEventListener("install", function setupPreCache(event) {
  async function addToCache() {
    const preCache = await caches.open(PRE_CACHE);
    await preCache.addAll(PRE_CACHE_URLS);
    await self.skipWaiting(); // progress to activating state
  }
  event.waitUntil(addToCache());
});

/*
 * Remove any old caches of this app when the service worker activates.
 * TODO clean up the HN_STORIES Cache, so it doesn't keep growing
 */
self.addEventListener("activate", function removeOldCaches(event) {
  const activeCaches = [PRE_CACHE, HN_STORIES];

  function deleteCaches(toDelete) {
    return Promise.all(
      toDelete.map((cache) => {
        return caches.delete(cache);
      })
    );
  }

  async function clearCache() {
    const availableCaches = await caches.keys();
    const cachesToDelete = availableCaches.filter(
      (cacheName) => !activeCaches.includes(cacheName)
    );
    await deleteCaches(cachesToDelete);
    await self.clients.claim();
  }
  event.waitUntil(clearCache());
});

/*
 * Cache resources on fetch
 */
self.addEventListener("fetch", function cacheHackerNewsRequests(event) {
  async function storeInCache(request, response) {
    const cache = await caches.open(HN_STORIES);
    cache.put(request, response);
  }

  /**
   * Cache First Strategy
   *
   * First we check if we have a cached response for a given request.
   * Return the cached response if we do. If we don't, make a request over the
   * network and store a clone of the result in the cache (if it was
   * successful) while we return the response
   *
   * @param {Request} request The request made by the application
   * @returns {Response} Response from the cache or network
   */
  async function getFromCacheOrFetch(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    // Only store 200 responses
    if (networkResponse.ok) {
      storeInCache(request, networkResponse.clone());
    }
    return networkResponse;
  }

  /**
   * Network First Strategy
   *
   * Try to get the latest result from the network. If the network fails,
   * try to return a result from the cache. If our cache hasn't been populated
   * we return an error Response.
   *
   * Useful from frequently updating resources
   *
   * @param {Request} request The request made by the application
   * @returns {Response} cache, network or error Response
   */
  async function getNetworkThenCache(request) {
    try {
      const networkResponse = await fetch(request);

      // Only store 200 responses
      if (networkResponse.ok) {
        storeInCache(request, networkResponse.clone());
      }

      return networkResponse;
    } catch (error) {
      // the network isn't available. check our cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      console.log("We are offline and there is no data in the cache", error);
      return new Response("", {
        status: 503, // TODO status code 503 doesn't make much sense. What would be more appropriate?
        statusText:
          "We are offline and there is no data in our local cache. Please try again later",
      });
    }
  }

  /*
   * Use 2 different caching strategies for the resources we use.
   *
   * maxitem.json will use a Network First strategy given that it's updating frequently
   * item/{id}.json will use a Cache First strategy since the items do not
   * change often.
   */
  const itemRegex = /^https:\/\/hacker-news\.firebaseio\.com\/v0\/item\/\d+\.json$/;
  const maxItemURL = "https://hacker-news.firebaseio.com/v0/maxitem.json";

  if (itemRegex.test(event.request.url)) {
    return event.respondWith(getFromCacheOrFetch(event.request));
  } else if (event.request.url === maxItemURL) {
    return event.respondWith(getNetworkThenCache(event.request));
  }
});
