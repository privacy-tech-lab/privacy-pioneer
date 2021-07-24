import { openDB } from "idb";

/**
* Create/open indexed-db to store keywords for watchlist
*/
const dbPromise = openDB("watchlist-store", 1, {
    upgrade(db) {
      db.createObjectStore("watchlist");
    },
});
  
/**
* Wrapper functions for CRUD operations of 'watchlist' indexed-db
*/
const watchlistKeyval = {
    async get(key) {
      return (await dbPromise).get("watchlist", key);
    },
    async set(key, val) {
      return (await dbPromise).put("watchlist", val, key);
    },
    async delete(key) {
      return (await dbPromise).delete("watchlist", key);
    },
    async clear() {
      return (await dbPromise).clear("watchlist");
    },
    async keys() {
      return (await dbPromise).getAllKeys("watchlist");
    },
    async values() {
      return (await dbPromise).getAll("watchlist");
    },
};

  export { watchlistKeyval }