import { evidenceKeyval as evidenceIDB } from "../../background/analysis/interactDB/openDB.js";
import { privacyLabels, storeEnum } from "../../background/analysis/classModels";
import Parents from "../../assets/parents.json";


/**
 * Get identified labels of website from indexedDB
 * Restucture to display in UI
 * result: {..., label: {..., requestURL: {..., labelType: requestObject}}}
 */
export const getWebsiteLabels = async (website) => {
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
 * Get identified labels of all websites in an array from indexedDB
 * result: {..., website: {...,label: {..., requestURL: {..., labelType: requestObject}}}}
 */

export const getAllWebsiteLabels = async (websites) => {
  let weblabels = {};
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
 * Uses above function to iterate through websites
 * Made for UI implementation
 * result: {label : number of websites that uses label }
 */

export const getLabels = async (websites) => {
  let labels = {};
  try {
    for (const website of Object.keys(websites)) {
      await getWebsiteLabels(website).then((res) => {
        Object.keys(res).forEach((label) => {
          Object.keys(labels).includes(label)
            ? (labels[label] += getNumOfWebsites(res[label]))
            : (labels[label] = getNumOfWebsites(res[label]));
        });
      });
    }
    return labels;
  } catch (error) {
    return labels;
  }
};

const getNumOfWebsites = (label) => Object.keys(label).length;

/**
 * Get all identified websites and thier labels from indexedDB
 * @returns {Object} result: {..., websiteURL: [..., label]}
 */

export const getWebsites = async () => {

  /**
   * Helper function.
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
