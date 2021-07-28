import Parents from "../../assets/parents.json"

/**
 * Takes a given label Object and returns an array of
 * all parent companies for that
 * label to be displayed in the UI
 *
 * @param {Object} labels
 * @returns {Object} Returns Object of parent companies with icons, without icons and websites with iconed companies
 */

export const getParents = (labels) => {
  const companies = {}
  if (labels) {
    Object.keys(labels).forEach((website) => {
      const evidenceType = Object.keys(labels[website])[0]
      const company = labels[website][evidenceType]["parentCompany"]
      if (company) {
        if (!Object.keys(companies).includes(company)) {
          companies[company] = {}
          companies[company]["websites"] = [website]
        } else companies[company]["websites"].push(company)

        if (companiesWithSVG.has(company)) {
          companies[company]["hasIcon"] = true
        } else companies[company]["hasIcon"] = false
      }
    })
    return companies
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
