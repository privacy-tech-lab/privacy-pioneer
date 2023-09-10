/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { evidenceKeyval as evidenceIDB } from "../../background/analysis/interactDB/openDB.js";
import {
  Evidence,
  permissionEnum,
  privacyLabels,
} from "../../background/analysis/classModels";
import { getExcludedLabels } from "../indexed-db/settings";

/**
 * Get identified labels of website from indexedDB
 * Restucture to display in UI
 * result: {..., label: {..., requestURL: {..., labelType: requestObject}}}
 * @param {string} website
 * @param {string[]} excludedLabels 
 */
export const getWebsiteLabels = async (website, excludedLabels = []) => {
  try {
    var evidence = await evidenceIDB.get(website);
    const result = {};
    for (const [label, value] of Object.entries(evidence)) {
      for (const [type, requests] of Object.entries(value)) {
        for (const [url, e] of Object.entries(requests)) {
          // Verify label and type are in privacyLabels
          if (label in privacyLabels &&
            type in privacyLabels[label]["types"] &&
            !excludedLabels.includes(label)) {
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
}

/**
 * Get identified labels of website from indexedDB from latest browsing session
 * Restucture to display in UI
 * result: {..., label: {..., requestURL: {..., labelType: requestObject}}}
 * @param {string} website
 */
export const getWebsiteLastVisitedEvidence = async (website) => {
  try {
    const labels = await getWebsiteLabels(website);
    const lastSeen = (await evidenceIDB.get(website)).lastSeen;
    var result = {};

    for (const [label, value] of Object.entries(labels)) {
      for (const [url, typeVal] of Object.entries(value)) {
        for (const [type, e] of Object.entries(typeVal)) {
          if (type === "userKeyword") {
            for (const el of e) {
              //Check if the evidence has been added recently
              var isCurrentSessionEvidence = el["timestamp"] >= lastSeen - 60000;

              if (isCurrentSessionEvidence) {
                // Add label in data to object
                if (!(label in result)) {
                  result[label] = { [url]: { [type]: Array(el) } };
                } else if (!(url in result[label])) {
                  result[label][url] = { [type]: Array(el) };
                } else {
                  result[label][url][type].push(el);
                }
              }
            }
          } else {
            //Check if the evidence has been added recently
            var isCurrentSessionEvidence = e["timestamp"] >= lastSeen - 60000;

            if (isCurrentSessionEvidence) {
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
    }
    return result;
  } catch (error) {
    return {};
  }
}

/**
 * Get identified labels of all websites stored in indexedDB
 * @param {string[]} excludedLabels
 * @returns: {..., website: {...,label: {..., requestURL: {..., labelType: requestObject}}}}
 */

const getAllWebsiteLabels = async (excludedLabels = []) => {
  const weblabels = {};
  const websites = await getWebsites();
  try {
    Object.keys(websites).forEach((website) => {
      getWebsiteLabels(website, excludedLabels).then(
        (res) => (weblabels[website] = res)
      );
    });
    return weblabels;
  } catch (error) {
    return weblabels;
  }
}

/**
 * Builds up dictionary of labels
 *
 * @param {object} res Resulting dictionary
 * @param {string[]} excludedLabels
 * @returns Void
 */
const buildLabels = async (res, excludedLabels) => {
  try {
    const websites = await evidenceIDB.keys();
    for (const website of websites) {
      const evidence = await evidenceIDB.get(website); // website evidence from indexedDB
      const labels = Object.keys(evidence).filter(
        (label) => label in privacyLabels && !excludedLabels.includes(label)
      ); // verify label in privacy labels
      const timestamp = getTimeStamp(evidence);

      if (labels.length && !(website in res)) {
        res[website] = {};
        res[website].labels = labels;
        res[website].timestamp = timestamp;
      } // give priority to first party labels if we have the same key in both stores
    }
  } catch (error) {
    return {};
  }
}

/**
 * Get all identified websites and thier labels from indexedDB
 * @returns  result: {..., websiteURL: [..., label]}
 */

export const getWebsites = async () => {
  try {
    const excludedLabels = await getExcludedLabels();
    const unsortedResult = {};

    await buildLabels(unsortedResult, excludedLabels);

    const sortedResult = sortEvidence(unsortedResult);
    return sortedResult;
  } catch (error) {
    return {};
  }
}

/**
 * @param {Evidence} evidence
 */
const getTimeStamp = (evidence) => {
  var timestamp = 0;
  Object.keys(evidence).forEach((permission) => {
    Object.keys(evidence[permission]).forEach((type) => Object.keys(evidence[permission][type]).forEach((website) => {
      timestamp =
        evidence[permission][type][website].timestamp > timestamp
          ? evidence[permission][type][website].timestamp
          : timestamp;
    })
    );
  });
  return timestamp;
}

/**
 * @param {object} websites
 */
const sortEvidence = (websites) => {
  let entries = Object.entries(websites);

  entries.sort(function ([websiteA, evidenceA], [websiteB, evidenceB]) {
    return evidenceB.timestamp - evidenceA.timestamp;
  });

  return Object.fromEntries(entries);
}

/**
 * Uses above function to iterate through websites
 * Made for UI implementation
 * @param {string[]|null} filter Optional parameter to limit labels to specific permissions
 * @returns Labels sorted in various ways
 */
export const getLabels = async (filter = null) => {
  let res = {};
  var excludedLabels = await getExcludedLabels();
  if (filter !== null) {
    excludedLabels = excludedLabels.concat(
      filter.filter((label) => excludedLabels.indexOf(label) < 0)
    );
  }
  const labels = await getAllWebsiteLabels(excludedLabels);
  const websites = Object.keys(await getWebsites());

  Object.values(permissionEnum).forEach((label) => {
    if (!excludedLabels.includes(label)) res[label] = {};
  });

  websites.forEach((website) => {
    Object.keys(labels[website]).forEach((label) => {
      res[label][website] = labels[website][label];
    });
  });

  return res;
}
