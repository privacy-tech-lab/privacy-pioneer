import { openDB } from "idb"

const dbPromise = openDB("watchlist-store", 1, {
  upgrade(db) {
    db.createObjectStore("watchlist")
  },
})

export const WatchlistKeyval = {
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

// to convert a regular string into digits
// taken basically from: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
export const hash = (str) => {
  var hash = 0,
    i,
    chr
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash.toString()
}
