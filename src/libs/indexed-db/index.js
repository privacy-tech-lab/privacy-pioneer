import { openDB } from "idb";
import { evidenceKeyval as evidenceIDB } from "../../background/analysis/interactDB/openDB.js";
import {
  keywordTypes,
  permissionEnum,
  privacyLabels,
  storeEnum,
} from "../../background/analysis/classModels";
import { getExcludedLabels } from "../settings";
import Parents from "../../assets/parents.json";

/**
 * Create/open indexed-db to store keywords for watchlist
 */
const dbPromise = openDB("UserData-store", 1, {
  upgrade(db) {
    db.createObjectStore("watchlist");
    db.createObjectStore("userSettings");
  },
});

/**
 * Wrapper functions for CRUD operations of 'watchlist' indexed-db
 */
export const watchlistKeyval = {
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

export const settingsKeyval = {
  async get(key) {
    return (await dbPromise).get("userSettings", key);
  },
  async set(key, val) {
    return (await dbPromise).put("userSettings", val, key);
  },
  async delete(key) {
    return (await dbPromise).delete("userSettings", key);
  },
  async clear() {
    return (await dbPromise).clear("userSettings");
  },
  async keys() {
    return (await dbPromise).getAllKeys("userSettings");
  },
  async values() {
    return (await dbPromise).getAll("userSettings");
  },
};

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
};

/**
 * Saves/updates keyword from wathlist store
 * Updates keyword when 'id' is not undefined
 * Return true if successful, false otherwise
 */
export const saveKeyword = async (keyword, type, id) => {
  // Validate
  if (type in keywordTypes && keyword) {
    let key;
    if (id != null) {
      key = id;
    } else {
      key = hash(type.concat(keyword)).toString();
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
        });
    return true;
  }
  return false;
};

/**
 * Deletes keyword from watchlist store
 */
export const deleteKeyword = async (id) => {
  await watchlistKeyval.delete(id);
};

/**
 * Get identified labels of website from indexedDB
 * Restucture to display in UI
 * result: {..., label: {..., requestURL: {..., labelType: requestObject}}}
 */
export const getWebsiteLabels = async (website) => {
  const excludedLabels = await getExcludedLabels();
  try {
    var evidence = await evidenceIDB.get(website, storeEnum.firstParty); // first try first party DB
    if (evidence == undefined) {
      evidence = await evidenceIDB.get(website, storeEnum.thirdParty);
    } // then try third party DB
    const result = {};
    for (const [label, value] of Object.entries(evidence)) {
      for (const [type, requests] of Object.entries(value)) {
        for (const [url, e] of Object.entries(requests)) {
          // Verify label and type are in privacyLabels
          if (label in privacyLabels && type in privacyLabels[label]["types"]) {
            // Add label in data to object
            if (!(label in result)) {
              result[label] = { [url]: { [type]: e } };
            } else if (!(url in result[label])) {
              result[label][url] = { [type]: e };
            } else {
              result[label][url][type] = e;
            }
          }
        }
      }
    }
    return result;
  } catch (error) {
    return {};
  }
};

/**
 * Get identified labels of all websites stored in indexedDB
 * result: {..., website: {...,label: {..., requestURL: {..., labelType: requestObject}}}}
 */

const getAllWebsiteLabels = async () => {
  const weblabels = {};
  const websites = await getWebsites();
  try {
    Object.keys(websites).forEach((website) => {
      getWebsiteLabels(website).then((res) => (weblabels[website] = res));
    });
    return weblabels;
  } catch (error) {
    return weblabels;
  }
};

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
const buildLabels = async (store, res) => {
  try {
    const websites = await evidenceIDB.keys(store);
    for (const website of websites) {
      const evidence = await evidenceIDB.get(website, store); // website evidence from indexedDB
      const labels = Object.keys(evidence).filter(
        (label) => label in privacyLabels
      ); // verify label in privacy labels
      if (labels.length && !(website in res)) res[website] = labels; // give priority to first party labels if we have the same key in both stores
    }
  } catch (error) {
    return {};
  }
};

/**
 * Get all identified websites and thier labels from indexedDB
 * @returns {Object} result: {..., websiteURL: [..., label]}
 */

export const getWebsites = async () => {
  try {
    const result = {};

    await buildLabels(storeEnum.firstParty, result); // first party labels
    await buildLabels(storeEnum.thirdParty, result); // third party labels

    return result;
  } catch (error) {
    return {};
  }
};

/**
 * Uses above function to iterate through websites
 * Made for UI implementation
 * @returns Labels sorted in various ways
 */

export const getLabels = async () => {
  let res = {};
  const excludedLabels = await getExcludedLabels();
  const labels = await getAllWebsiteLabels();
  res["excludedLabels"] = excludedLabels;
  const websites = Object.keys(await getWebsites());

  Object.values(permissionEnum).forEach((label) => {
    res[label] = {};
  });

  websites.forEach((website) => {
    Object.keys(labels[website]).forEach((label) => {
      res[label][website] = labels[website][label];
    });
  });

  return res;
};

/**
 * Takes a given label Object and returns an array of
 * all parent companies for that
 * label to be displayed in the UI
 *
 * @param {Object} labels
 * @returns {Array} Returns array of parent companies
 */

export const getParents = (labels) => {
  let parents = [];
  if (labels) {
    Object.keys(labels).forEach((website) => {
      let evidenceType = Object.keys(labels[website])[0];
      let parent = labels[website][evidenceType]["parentCompany"];
      if (parent) !parents.includes(parent) ? parents.push(parent) : null;
      else parents.push(website);
    });
  }
  return parents;
};

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
]);
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
      return parentSite;
    }
  }
  for (const [parentSite, childrenSites] of Object.entries(
    Parents.entriesDisconnect
  )) {
    if (childrenSites.includes(website) && companiesWithSVG.has(parentSite)) {
      return parentSite;
    }
  }
};
