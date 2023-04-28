/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { Evidence, permissionEnum } from "../classModels.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Utility function to create hash for watchlist key based on keyword and type
 * This will overwrite keywords in the watchlist store that have the same keyword and type
 * Which is okay
 * from: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 * @param {string} str
 * @returns {number}
 */
function hashTypeAndPermission(str) {
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
 * Returns only the hostnames from a url. code from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
 * @param {string} url
 * @returns {string} The hostname of the given URL. '' if URL undefined
 */
function extractHostname(url) {
  if (typeof url == "undefined") return "";

  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}

/**
 * Takes a url and returns its domain.
 * https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
 * @param {string} url
 * @returns {string} The domain of a the inputted url, '' if input undefined
 */
function getHostname(url) {
  if (typeof url == "undefined") return "";
  var domain = extractHostname(url),
    splitArr = domain.split("."),
    arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
    // domain = second to last and last domain. could be (xyz.me.uk) or (xyz.uk)
    domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      //this is using a ccTLD. set domain to include the actual host name
      domain = splitArr[arrLen - 3] + "." + domain;
    }
  }
  return domain;
}

/**
 * Utility function to create an evidence Object with incomplete information.
 * Called by search functions. Passed to addToEvidence where the object is fully
 * fully updated and placed in the DB.
 * See Evidence object in classmodels.js for param explanations
 *
 * @param {string} permission
 * @param {string} rootUrl
 * @param {string} snippet
 * @param {string} requestUrl
 * @param {string} typ
 * @param {Array|undefined} index
 * @param {number} watchlistHash
 * @param {string|undefined} extraDetail
 * @param {boolean} cutDown
 * @param {string|undefined} loc
 * @returns {Evidence}
 */
function createEvidenceObj(
  permission,
  rootUrl,
  snippet,
  requestUrl,
  typ,
  index,
  watchlistHash = undefined,
  extraDetail = undefined
) {
  const e = new Evidence({
    timestamp: undefined,
    permission: permission,
    rootUrl: rootUrl,
    snippet: snippet,
    requestUrl: requestUrl,
    typ: typ,
    index: index,
    firstPartyRoot: undefined,
    parentCompany: undefined,
    watchlistHash: watchlistHash,
    extraDetail: extraDetail,
    loc: undefined,
  });

  return e;
}

function watchlistHashGen(type, keyword) {
  if (typeof type != "string") {
    type = String(type);
  }
  if (typeof keyword != "string") {
    keyword = String(keyword);
  }
  return hashTypeAndPermission(type.concat(keyword)).toString();
}

const getAllPerms = () => {
  return [
    permissionEnum.location,
    permissionEnum.monetization,
    permissionEnum.tracking,
    permissionEnum.personal,
  ];
};

const removeLeadingWhiteSpace = (str) => {
  var index = 0;
  while (index < str.length && str.charAt(index) == " ") {
    index += 1;
  }
  return str.slice(index);
};

export {
  hashTypeAndPermission,
  extractHostname,
  getHostname,
  watchlistHashGen,
  createEvidenceObj,
  getAllPerms,
  removeLeadingWhiteSpace,
};
