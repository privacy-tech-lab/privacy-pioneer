/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import { openDB } from "idb"

/**
 * Create/open indexed-db to store keywords for watchlist
 */
 const dbPromise = openDB("UserData-store", 1, {
    upgrade(db) {
      db.createObjectStore("watchlist")
      db.createObjectStore("userSettings")
    },
  })
  
  /**
   * Wrapper functions for CRUD operations of 'watchlist' indexed-db
   */
  const watchlistKeyval = {
    async get(key) {
      return (await dbPromise).get("watchlist", key)
    },
    async set(key, val) {
      return (await dbPromise).put("watchlist", val, key)
    },
    async delete(key) {
      return (await dbPromise).delete("watchlist", key)
    },
    async clear() {
      return (await dbPromise).clear("watchlist")
    },
    async keys() {
      return (await dbPromise).getAllKeys("watchlist")
    },
    async values() {
      return (await dbPromise).getAll("watchlist")
    },
  }
  
  const settingsKeyval = {
    async get(key) {
      return (await dbPromise).get("userSettings", key)
    },
    async set(key, val) {
      return (await dbPromise).put("userSettings", val, key)
    },
    async delete(key) {
      return (await dbPromise).delete("userSettings", key)
    },
    async clear() {
      return (await dbPromise).clear("userSettings")
    },
    async keys() {
      return (await dbPromise).getAllKeys("userSettings")
    },
    async values() {
      return (await dbPromise).getAll("userSettings")
    },
  }

export { watchlistKeyval, settingsKeyval }