import Parents from "../../assets/parents.json"

/**
 * Takes a given label Object and returns an array of
 * all parent companies for that
 * label to be displayed in the UI
 *
 * @param {Object} labels
 * @returns {Array} Returns array of parent companies
 */

export const getParents = (labels) => {
  let companies = []
  let includedSites = []
  if (labels) {
    Object.keys(labels).forEach((website) => {
      let evidenceType = Object.keys(labels[website])[0]
      let company = labels[website][evidenceType]["parentCompany"]
      if (parent) {
        if (!companies.includes(company))
          companies.push(company), includedSites.push(website)
        else includedSites.push(website)
      }
    })
    return { companies, includedSites }
  }
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
