import { evidenceKeyval as evidenceIDB } from "../../background/analysis/interactDB/openDB.js"
import {
  permissionEnum,
  privacyLabels,
  storeEnum,
} from "../../background/analysis/classModels"
import { getExcludedLabels } from "../settings/index.js"
const exData = require("../../assets/exampleData.json")

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
 * @returns: {..., website: {...,label: {..., requestURL: {..., labelType: requestObject}}}}
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
      const timestamp = getTimeStamp(evidence)

      if (labels.length && !(website in res)) {
        res[website] = {}
        res[website].labels = labels
        res[website].timestamp = timestamp
      } // give priority to first party labels if we have the same key in both stores
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
    const unsortedResult = {}

    await buildLabels(storeEnum.firstParty, unsortedResult, excludedLabels) // first party labels
    await buildLabels(storeEnum.thirdParty, unsortedResult, excludedLabels) // third party labels

    const sortedResult = sortEvidence(unsortedResult)

    if (Object.keys(sortedResult).length == 0) return exData.labelArrayPerSite
    
    return sortedResult
  } catch (error) {
    return {}
  }
}

const getTimeStamp = (evidence) => {
  var timestamp = 0
  Object.keys(evidence).forEach((permission) => {
    Object.keys(evidence[permission]).forEach((type) =>
      Object.keys(evidence[permission][type]).forEach((website) => {
        timestamp =
          evidence[permission][type][website].timestamp > timestamp
            ? evidence[permission][type][website].timestamp
            : timestamp
      })
    )
  })
  return timestamp
}

const sortEvidence = (websites) => {
  let entries = Object.entries(websites)

  entries.sort(function ([websiteA, evidenceA], [websiteB, evidenceB]) {
    return evidenceB.timestamp - evidenceA.timestamp
  })

  return Object.fromEntries(entries)
}

/**
 * Uses above function to iterate through websites
 * Made for UI implementation
 * @returns Labels sorted in various ways
 */

export const getLabels = async () => {
  let res = {}
  var labels = await getAllWebsiteLabels()
  const websites = Object.keys(await getWebsites())
  console.log(websites[0])
  if (websites[0] == "invasive_site.com") {
    console.log('in labels')
    labels = exData.dataJson
  }
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
