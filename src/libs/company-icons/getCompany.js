import Parents from "../../assets/parents.json";

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
  
  // This is the list of companies we have SVGs for. Will be updated as needed
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
   * Obtains the parent company from the website name
   *
   * @param {string} website
   * @returns parent company from website name
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
  