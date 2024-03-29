/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { Evidence } from "../classModels.js";
import psl from "psl";

/**
 * Utility function to create hash for watchlist key based on keyword and type
 * This will overwrite keywords in the watchlist store that have the same keyword and type
 * Which is okay
 * from: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 * @param {string} str
 * @returns {number}
 */
export function hashTypeAndPermission(str) {
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
export function extractHostname(url) {
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
export function getHostname(url) {
  if (typeof url == "undefined") return "";
  return psl.parse(extractHostname(url)).domain ?? "";
}

/**
 * Utility function to create an evidence Object with incomplete information.
 * Called by search functions. Passed to addToEvidence where the object is fully
 * fully updated and placed in the DB.
 * See Evidence object in classmodels.js for param explanations
 *
 * @param {string} permission
 * @param {string} rootUrl
 * @param {string|null} snippet
 * @param {string} requestUrl
 * @param {string} typ
 * @param {number[]|undefined} index
 * @param {number|undefined} watchlistHash
 * @param {string|undefined} extraDetail
 * @returns {Evidence}
 */
export function createEvidenceObj(
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
    cookie: undefined,
    loc: undefined,
  });

  return e;
}

/**
 *
 * @param {string} type
 * @param {string|RegExp} keyword
 * @returns {number}
 */
export function watchlistHashGen(type, keyword) {
  if (typeof type != "string") {
    type = String(type);
  }
  if (typeof keyword != "string") {
    keyword = String(keyword);
  }
  return hashTypeAndPermission(type.concat(keyword));
}

/**
 * @param {string} str
 */
export function removeLeadingWhiteSpace(str) {
  var index = 0;
  while (index < str.length && str.charAt(index) == " ") {
    index += 1;
  }
  return str.slice(index);
}