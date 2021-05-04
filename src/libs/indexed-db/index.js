import { openDB } from "idb"
import { EvidenceKeyval as evidenceIDB } from "../../background/analysis/openDB"
import { privacyLabels } from "../../background/analysis/classModels"

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

/**
 * Get identified labels of website from indexedDB
 * Restucture to display in UI
 * result: {..., label: {..., requestURL: {..., labelType: requestObject}}}
 */
export const getWebsiteLabels = async (website) => {
  try {
    const evidence = await evidenceIDB.get(website) // website evidence from indexedDB
    const result = {}
    for (const [label, value] of Object.entries(evidence)) {
      for (const [type, requests] of Object.entries(value)) {
        for (const [url, request] of Object.entries(requests)) {
          // Verify label and type are in privacyLabels
          if (label in privacyLabels && type in privacyLabels[label]["types"]) {
            // Add label in data to object
            if (!(label in result)) {
              result[label] = { [url]: { [type]: request } }
            } else if (!(url in result[label])) {
              result[label][url] = { [type]: request }
            } else {
              result[label][url][type] = request
            }
          }
        }
      }
    }
    return result
  } catch (error) {
    return {}
  }
}

/**
 * Get all identified websites and thier labels from indexedDB
 * Restucture to display in UI
 * result: {..., websiteURL: [..., label]}
 */
export const getWebsites = async () => {
  try {
    const websites = await evidenceIDB.keys()
    const result = {}
    for (const website of websites) {
      const evidence = await evidenceIDB.get(website) // website evidence from indexedDB
      const labels = Object.keys(evidence).filter((label) => label in privacyLabels) // verify label in privacy labels
      if (labels.length) result[website] = labels
    }
    return result
  } catch (error) {
    return {}
  }
}
