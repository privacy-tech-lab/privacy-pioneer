/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { removeLeadingWhiteSpace } from "../../../../../../../background/analysis/utility/util";
import { CompanyLogoSVG } from "../../../../../../../libs/icons/company-icons";

/**
 * Function to filter labels with company and Permission filters
 */
export const filterLabelObject = (
  allLabels,
  permFilter,
  companyFilter = null,
  runCompanyFilter = false
) => {
  const updatedLabels = JSON.parse(JSON.stringify(allLabels));

  for (const [perm, value] of Object.entries(updatedLabels)) {
    if (!permFilter[perm]) {
      delete updatedLabels[perm];
    } else {
      if (runCompanyFilter) {
        for (const [rootUrl, requests] of Object.entries(value)) {
          for (const [url, evLevel] of Object.entries(requests)) {
            for (const [typ, e] of Object.entries(evLevel)) {
              const parent = e.parentCompany;
              if (
                parent != null &&
                parent in companyFilter &&
                companyFilter[parent]
              ) {
                //pass
              } else {
                delete updatedLabels[perm][rootUrl][url][typ];
                if (
                  Object.keys(updatedLabels[perm][rootUrl][url]).length == 0
                ) {
                  delete updatedLabels[perm][rootUrl][url];
                  if (Object.keys(updatedLabels[perm][rootUrl]).length == 0) {
                    delete updatedLabels[perm][rootUrl];
                    if (Object.keys(updatedLabels[perm]).length == 0) {
                      delete updatedLabels[perm];
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  for (const perm of Object.keys(updatedLabels)) {
    if (Object.keys(updatedLabels[perm]) == 0) {
      delete updatedLabels[perm];
    }
  }
  return updatedLabels;
};

/**
 * Takes in a type passed from the previous page and returns
 * the appropriate filter mapping
 * @param {string} typ
 * @returns {Dict}
 */

export const getPermMapping = (typ) => {
  const mapping = {
    monetization: false,
    location: false,
    watchlist: false,
    tracking: false,
  };
  mapping[typ] = true;
  return mapping;
};

/**
 * Filter websites based on user input string from text field
 * @param {string} keyString string the user entered
 * @param {Dict} websites Dictionary of websites
 * @param {Dict} permFilter
 */
export const filter = (keyString, websites, permFilter) => {
  const perms = Object.keys(permFilter).filter((perm) => permFilter[perm]);

  keyString = removeLeadingWhiteSpace(keyString).toLowerCase();
  const filteredWebsites = {};

  Object.keys(websites)
    .filter(
      (k) =>
        k.includes(keyString) &&
        perms.some((r) => websites[k].labels.includes(r))
    )
    .forEach((site) => (filteredWebsites[site] = websites[site]));

  return filteredWebsites;
};

/**
 * maps all stored companies to false to initialize filters
 */
export const getEmptyCompanyFilter = () => {
  var mapping = {};
  Object.keys(CompanyLogoSVG).map((company) => {
    mapping[company] = false;
  });
  return mapping;
};

/**
 * Looks for filters and applies them as appropriate.
 *
 * @param {string} keyString
 */
export const filterLabels = (
  permFilterLabels,
  companyFilterLabels,
  defaultLabels,
  setPlaceholder
) => {
  const runFilter = Object.values(
    permFilterLabels,
    companyFilterLabels,
    permFilterLabels
  ).some((isToggled) => !isToggled);
  const runCompanyFilter = Object.values(companyFilterLabels).some(
    (isToggled) => isToggled
  );

  setPlaceholder(
    getPlaceholder(runCompanyFilter, companyFilterLabels, permFilterLabels)
  );

  if (runFilter || runCompanyFilter) {
    const filtered = filterLabelObject(
      defaultLabels,
      permFilterLabels,
      companyFilterLabels,
      runCompanyFilter
    );
    return filtered;
  } else {
    return defaultLabels;
  }
};

/**
 * Looks at the filter to create a placeholder string
 * @returns {string}
 */
export const getPlaceholder = (
  hasCompanyFilter = false,
  companyFilter,
  permFilter
) => {
  const defaultPlaceholder = "in: All ";
  var updatedPlaceholder = "in: ";
  var ct = 0;
  for (const [perm, bool] of Object.entries(permFilter)) {
    if (bool) {
      ct += 1;
      updatedPlaceholder = updatedPlaceholder.concat(perm).concat(" ");
    }
  }

  if (ct == 4) {
    updatedPlaceholder = defaultPlaceholder;
  }
  if (ct == 0) {
    return "in: None ";
  }
  if (hasCompanyFilter) {
    updatedPlaceholder = updatedPlaceholder.concat("companies: ");
    for (const [company, setting] of Object.entries(companyFilter)) {
      if (setting) {
        updatedPlaceholder = updatedPlaceholder.concat(`${company} `);
      }
    }
  }
  return updatedPlaceholder;
};
