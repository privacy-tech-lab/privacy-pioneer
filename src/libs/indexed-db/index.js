import { openDB } from "idb"
import { EvidenceKeyval as evidenceIDB } from "../../background/analysis/openDB"
import { getHostname } from "../../background/analysis/searchFunctions"
import { privacyLabels } from "../constants"

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

// Get labels from domain
export const getDomainLabels = async (domain) => {
  try {
    const domainEvidence = await evidenceIDB.get(domain)
    const data = {}
    for (const [key, value] of Object.entries(domainEvidence)) {
      for (const label of Object.keys(privacyLabels)) {
        if (key.toLowerCase().includes(label.toLowerCase())) {
          let key = getHostname(value["requestUrl"])
          let subKey = value["typ"]
          if (label in data) {
            if (key in data[label]) {
              data[label][key][subKey] = value
            } else {
              data[label][key] = { [subKey]: value }
            }
          } else {
            data[label] = { [key]: { [subKey]: value } }
          }
        }
      }
    }
    return data
  } catch (error) {
    return {}
  }
}

// Get websites and labels
export const getWebsites = async () => {
  try {
    const data = {}
    const evidence = await evidenceIDB.keys()
    for (let website of evidence) {
      let value = await evidenceIDB.get(website)
      for (const [key, _] of Object.entries(value)) {
        for (const label of Object.keys(privacyLabels)) {
          if (key.toLowerCase().includes(label.toLowerCase())) {
            if (website in data) {
              data[website].add(label)
            } else {
              data[website] = new Set([label])
            }
          }
        }
      }
    }
    return data
  }
  catch (error) {
    return {}
  }
}
