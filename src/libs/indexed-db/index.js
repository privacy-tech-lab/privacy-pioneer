import { openDB } from "idb"
import { evidenceKeyval as evidenceIDB } from "../../background/analysis/interactDB/openDB.js"
import {
  keywordTypes,
  permissionEnum,
  privacyLabels,
  storeEnum,
  typeEnum,
} from "../../background/analysis/classModels"
import Parents from "../../assets/parents.json"
import { watchlistHashGen } from "../../background/analysis/utility/util.js"
import { getState } from "../../background/analysis/buildUserData/structuredRoutines.js"
import { getExcludedLabels } from "../settings/index.js"

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
export const watchlistKeyval = {
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

export const settingsKeyval = {
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

/**
 * Saves/updates keyword from wathlist store
 * Updates keyword when 'id' is not undefined
 * Return true if successful, false otherwise
 */
export const saveKeyword = async (keyword, type, id) => {
  // Validate
  if (type in keywordTypes && keyword) {
    let key
    if (id != null) {
      key = id
    } else if (type == permissionEnum.location) {
      let watchlist = await watchlistKeyval.values()
      var maxNum = 0
      watchlist.forEach((el) => {
        if (el.type == permissionEnum.location) {
          maxNum = Math.max(maxNum, el.locNum)
        }
      })
      maxNum = (maxNum + 1).toString()
      key = watchlistHashGen(type, maxNum)
    } else {
      key = watchlistHashGen(type, keyword)
    }
    type != permissionEnum.location
      ? await watchlistKeyval.set(key, {
          keyword: keyword,
          type: type,
          id: key,
        })
      : await watchlistKeyval.set(key, {
          location: keyword,
          type: type,
          id: key,
          locNum: maxNum,
        })
    return true
  }
  return false
}

/**
 * Deletes keyword from watchlist store
 */
export const deleteKeyword = async (id, type) => {
  let firstEvKeys = await evidenceIDB.keys(storeEnum.firstParty)
  let thirdEvKeys = await evidenceIDB.keys(storeEnum.thirdParty)

  // this will be a singleton set for all cases except (this needs two lines because Set(id) adds each char as an element)
  var idSet = new Set()
  idSet.add(id)

  /* for location elements, we need to delete all of its associated ids so
   * we fetch the object, generate the hashes for all of its values, and add
   * those to our set */
  if (type == permissionEnum.location) {
    const deletedItem = await watchlistKeyval.get(id)
    for (const [type, keyword] of Object.entries(deletedItem.location)) {
      idSet.add(watchlistHashGen(type, keyword))
      // then we also need to get the full state name from the zip
      if (type == typeEnum.zipCode) {
        let st, state
        ;[st, state] = getState(keyword)
        idSet.add(watchlistHashGen(typeEnum.state, state))
      }
    }
  }

  /**
   * Deletes evidence if watchlistHash of the evidence is the same as the id we are deleting from the watchlist
   * @param {Object} evidenceStoreKeys All keys from the related store, taken from the above lines
   * @param {String} store Store name from storeEnum
   */
  function runDeletion(evidenceStoreKeys, store) {
    evidenceStoreKeys.forEach(async (website) => {
      let a = await evidenceIDB.get(website, store)
      if (a == undefined) {
        return
      } // shouldn't happen but just in case
      for (const [perm, typeLevel] of Object.entries(a)) {
        for (const [type, evUrls] of Object.entries(typeLevel)) {
          for (const [evUrl, evidence] of Object.entries(evUrls)) {
            if (idSet.has(evidence.watchlistHash)) {
              delete a[perm][type][evUrl]
            }
          }
          if (Object.keys(a[perm][type]).length == 0) {
            delete a[perm][type]
          }
        }
        if (Object.keys(a[perm]).length == 0) {
          delete a[perm]
        }
      }
      await evidenceIDB.set(website, a, store)
    })
  }

  // delete from Evidence
  runDeletion(firstEvKeys, storeEnum.firstParty)
  runDeletion(thirdEvKeys, storeEnum.thirdParty)

  // delete from watchlist
  await watchlistKeyval.delete(id)
}

/**
 * Get identified labels of website from indexedDB
 * Restucture to display in UI
 * result: {..., label: {..., requestURL: {..., labelType: requestObject}}}
 */
export const getWebsiteLabels = async (website) => {
  const excludedLabels = await getExcludedLabels()
  try {
    var evidence = await evidenceIDB.get(website, storeEnum.firstParty) // first try first party DB
    if (evidence == undefined) {
      evidence = await evidenceIDB.get(website, storeEnum.thirdParty)
    } // then try third party DB
    const result = {}
    for (const [label, value] of Object.entries(evidence)) {
      for (const [type, requests] of Object.entries(value)) {
        for (const [url, e] of Object.entries(requests)) {
          // Verify label and type are in privacyLabels
          if (
            label in privacyLabels &&
            type in privacyLabels[label]["types"] &&
            !excludedLabels.includes(label)
          ) {
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
 * Get identified labels of all websites stored in indexedDB
 * result: {..., website: {...,label: {..., requestURL: {..., labelType: requestObject}}}}
 */

const getAllWebsiteLabels = async () => {
  const weblabels = {}
  const websites = await getWebsites()
  try {
    Object.keys(websites).forEach((website) => {
      getWebsiteLabels(website).then((res) => (weblabels[website] = res))
    })
    return weblabels
  } catch (error) {
    return weblabels
  }
}

/**
 *
 * @param {Dict} labels Labels sorted by websites with excluded labels removed if applicable
 * @returns Object with the key of each label and values of website that collect said label
 */

/**
 * Builds up dictionary of labels
 *
 * @param {String} store Which store from the evidenceKeyval you're drawing from
 * @param {Dict} res Resulting dictionary
 * @returns Void
 */
const buildLabels = async (store, res, excludedLabels) => {
  try {
    const websites = await evidenceIDB.keys(store)
    for (const website of websites) {
      const evidence = await evidenceIDB.get(website, store) // website evidence from indexedDB
      const labels = Object.keys(evidence).filter(
        (label) => label in privacyLabels && !excludedLabels.includes(label)
      ) // verify label in privacy labels
      if (labels.length && !(website in res)) res[website] = labels // give priority to first party labels if we have the same key in both stores
    }
  } catch (error) {
    return {}
  }
}

/**
 * Get all identified websites and thier labels from indexedDB
 * @returns {Object} result: {..., websiteURL: [..., label]}
 */

export const getWebsites = async () => {
  try {
    const excludedLabels = await getExcludedLabels()
    const result = {}

    await buildLabels(storeEnum.firstParty, result, excludedLabels) // first party labels
    await buildLabels(storeEnum.thirdParty, result, excludedLabels) // third party labels

    return result
  } catch (error) {
    return {}
  }
}

/**
 * Uses above function to iterate through websites
 * Made for UI implementation
 * @returns Labels sorted in various ways
 */

export const getLabels = async () => {
  let res = {}
  const labels = await getAllWebsiteLabels()
  const websites = Object.keys(await getWebsites())
  const excludedLabels = await getExcludedLabels()

  Object.values(permissionEnum).forEach((label) => {
    if (!excludedLabels.includes(label)) res[label] = {}
  })

  websites.forEach((website) => {
    Object.keys(labels[website]).forEach((label) => {
      res[label][website] = labels[website][label]
    })
  })

  return res
}

/**
 * Takes a given label Object and returns an array of
 * all parent companies for that
 * label to be displayed in the UI
 *
 * @param {Object} labels
 * @returns {Array} Returns array of parent companies
 */

export const getParents = (labels) => {
  let parents = []
  if (labels) {
    Object.keys(labels).forEach((website) => {
      let evidenceType = Object.keys(labels[website])[0]
      let parent = labels[website][evidenceType]["parentCompany"]
      if (parent) !parents.includes(parent) ? parents.push(parent) : null
      else parents.push(website)
    })
  }
  return parents
}

const companiesWithSVG = new Set([
  "AddThis",
  "Adobe",
  "Amazon",
  "AT&T",
  "Fox",
  "Ibm",
  "Ocacle",
  "Ebay",
  "Facebook",
  "Google",
  "Microsoft",
  "Salesforce",
  "Twitter",
  "Verizon",
  "Yandex",
])
/**
 * Returns parent company from website name
 *
 * @param {string} website
 */
export const getParent = (website) => {
  for (const [parentSite, childrenSites] of Object.entries(
    Parents.entriesOurs
  )) {
    if (childrenSites.includes(website) && companiesWithSVG.has(parentSite)) {
      return parentSite
    }
  }
  for (const [parentSite, childrenSites] of Object.entries(
    Parents.entriesDisconnect
  )) {
    if (childrenSites.includes(website) && companiesWithSVG.has(parentSite)) {
      return parentSite
    }
  }
}
