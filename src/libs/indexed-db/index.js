import { openDB } from "idb"
import { EvidenceKeyval as evidenceIDB } from "../../background/analysis/openDB"
import { keywordTypes, privacyLabels } from "../../background/analysis/classModels"

/**
 * Create/open indexed-db to store keywords for watchlist
 */
const dbPromise = openDB("watchlist-store", 1, {
  upgrade(db) {
    db.createObjectStore("watchlist")
  },
})

/**
 * Wrapper functions for CRUD operations of 'watchlist' indexed-db
 */
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

/**
 * Utility function to create hash for watchlist key based on keyword and type
 * This will overwrite keywords in the watchlist store that have the same keyword and type
 * Which is okay
 * from: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */ 
const hash = (str) => {
  var hash = 0,
     i,
     chr;
   for (i = 0; i < str.length; i++) {
     chr = str.charCodeAt(i);
     hash = (hash << 5) - hash + chr;
     hash |= 0;
   }
   return hash;
}

/**
 * Saves/updates keyword from wathlist store
 * Updates keyword when 'id' is not undefined
 * Return true if successful, false otherwise
 */
export const saveKeyword = async (keyword, type, id) => {
  // Validate
  if (type in keywordTypes && keyword !== "") {
    let key
    if (id != null) {
      key = id
    } else {
      key = hash(type.concat(keyword)).toString()
    }
    await WatchlistKeyval.set(key, { keyword: keyword, type: type, id: key })
    return true
  }
  return false
}

/**
 * Deletes keyword from watchlist store
 */
 export const deleteKeyword = async (id) => {
  await WatchlistKeyval.delete(id)
}

/**
 * Get identified labels of website from indexedDB
 * Restucture to display in UI
 * result: {..., label: {..., requestURL: {..., labelType: requestObject}}}
 */
export const getWebsiteLabels = async (website) => {
  try {
    const evidence = await evidenceIDB.get(website) // website evidence from indexedDB
    console.log(evidence)
    const result = {}
    for (const [label, value] of Object.entries(evidence)) {
      for (const [type, requests] of Object.entries(value)) {
        for (const [url, e] of Object.entries(requests)) {
          // Verify label and type are in privacyLabels
          if (label in privacyLabels && type in privacyLabels[label]["types"]) {
            // Add label in data to object
            if (!(label in result)) {
              result[label] = { [url]: { [type]: e } }
            } else if (!(url in result[label])) {
              result[label][url] = { [type]: e }
            } else {
              result[label][url][type] = e
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
 * Uses above function to iterate through websites 
 * Made for UI implementation
 * result: {label : number of websites that uses label }
 */

export const getLabels = async (websites) => {
  let labels = {}
  try {
    for (const website of Object.keys(websites)) {
      await getWebsiteLabels(website)
        .then((res) => {
          Object.keys(res).forEach(label => {
            Object.keys(labels).includes(label)
              ? labels[label] += getNumOfWebsites(res[label])
              : labels[label] = getNumOfWebsites(res[label])
          })
        })
    }
    return labels
  }
  catch (error) {
    return labels
  }
}

const getNumOfWebsites = (label) => Object.keys(label).length


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
