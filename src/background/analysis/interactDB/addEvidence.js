/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { getHostname } from "../utility/util.js";
import { evidenceKeyval } from "../interactDB/openDB.js";
import { Evidence, typeEnum } from "../classModels.js";
import { useModel } from "./ml/jsrun.js";

/**
 * Function used to update an already fetched evidence dictionary with a piece of evidence, e.
 *
 * Defined, used in addEvidence.js
 *
 * @param {object} evidenceDict The dictionary we are updating
 * @param {Evidence} e An evidence object
 * @returns {Object} The param evidenceDict, but updated with Evidence, e, appropriately
 */
function updateFetchedDict(evidenceDict, e) {
  // vars from the evidence object we are adding
  var evidence = evidenceDict;
  const reqUrl = getHostname(e.requestUrl);
  const perm = e.permission;
  const t = e.typ;

  // if we have this rootUrl in evidence already we check if we already have store_label
  if (Object.keys(evidence).length !== 0) {
    if (perm in evidence) {
      // if type is in the permission
      if (t in evidence[perm]) {
        // user keywords only
        if (t === "userKeyword") {
          if (evidence[perm][t][reqUrl] === undefined) {
            evidence[perm][t][reqUrl] = Array(e);
          } else {
            // if this exact keyword has been found on this website before, gives index, otherwise -1
            let haveKeywordEv = evidence[perm][t][reqUrl].findIndex(
              (el) => el["watchlistHash"] == e["watchlistHash"]
            );
            // if this exact keyword has been found on this website before, update timestamp
            if (haveKeywordEv !== -1) {
              evidence[perm][t][reqUrl][haveKeywordEv]["timestamp"] =
                e["timestamp"];
            } else {
              // this exact keyword has not been found on this website before, updates evidence
              evidence[perm][t][reqUrl].push(e);
            }
            return evidence;
          }
        }

        // all other types
        let hardNo = reqUrl in evidence[perm][t]; //we have exactly this evidence already
        // if we have the evidence update its timestamp
        if (hardNo) {
          evidence[perm][t][reqUrl]["timestamp"] = e["timestamp"];
        }
        // if this is a unique reqUrl, we save the evidence
        if (!hardNo) {
          evidence[perm][t][reqUrl] = e;
        } else {
          return evidence;
        }
      } else {
        // we don't have this type yet, so we initialize it
        evidence[perm][t] = {};
        t === "userKeyword"
          ? (evidence[perm][t][reqUrl] = Array(e))
          : (evidence[perm][t][reqUrl] = e);
      }
    } else {
      // we don't have this permission yet so we initialize
      evidence[perm] = {};

      // init dict for permission type pair
      evidence[perm][t] = {};

      t === "userKeyword"
        ? (evidence[perm][t][reqUrl] = Array(e))
        : (evidence[perm][t][reqUrl] = e);
    }
  }
  // we have don't have this rootUrl yet. So we init evidence at this url
  else {
    evidence[perm] = {};
    evidence[perm][t] = {};
    t === "userKeyword"
      ? (evidence[perm][t][reqUrl] = Array(e))
      : (evidence[perm][t][reqUrl] = e);
  }
  return evidence;
}

/**
 * addToEvidenceStore is the function that is called to populate the DB with a piece of evidence. Called by analyze.js when adding evidence.
 * The function is async because it makes calls to the DB and the browser history. Pieces of evidence are stored as
 * Evidence objects. These objects are stored at keys of their rootUrl. At each rootUrl, there is a dictionary with a permission level
 * (defined in permissionEnum) and then a further type level (defined in typeEnum). We store only one piece of evidence per permssion/type for a
 * given rootUrl and a maximum of 5 pieces of evidence in total for a permission/type.
 *
 * Defined in addEvidence.js
 *
 * Used in analyze.js
 *
 * @param {object} evidenceToAdd Evidence that the function should add to the correct store in evidenceIDB
 * @param {string|undefined} parent Parent company of the request Url, if possible
 * @param {string} rootU The rootUrl of the request
 * @param {string} requestU The requestUrl of the request
 * @returns {Promise<string>} Side effects only
 *
 */

// perm, rootU, snip, requestU, t, i, extraDetail = undefined)
export async function addToEvidenceStore(
  evidenceToAdd,
  parent,
  rootU,
  requestU
) {
  /**
   * This is a known bug where certain websites intiate requests where the rootURL
   * is undefined. rootURL comes from request.details["originUrl"] which is a property
   * of the onBeforeRequest callback:
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#details
   * In this case, we do not add evidence and return.
   */
  if (rootU == undefined) {
    return new Promise(function (resolve, reject) {
      resolve("undefined rootU");
    });
  }

  // whitelist ipinfo
  if (
    requestU.includes("https://ipinfo.io/json") ||
    requestU.includes("http://ipinfo.io/json") ||
    //@ts-ignore
    browser.runtime.getURL("").includes(rootU)
  ) {
    return new Promise(function (resolve, reject) {
      resolve("whitelist ipinfo");
    });
  }

  const ts = Date.now();
  const rootUrl = getHostname(rootU);
  var evidence = await evidenceKeyval.get(rootUrl);
  if (evidence === undefined) {
    evidence = {};
  }
  let userData;

  /**
   * Unpacks and updates an evidence object to add to to our stores in evidenceIDB
   *
   * Defined, used in addEvidence.js
   *
   * @param {object} evidenceObject The evidence object to add
   * @returns {Promise<void>} side effects only
   */
  async function unpackAndUpdate(evidenceObject) {
    // if this is a valid object

    if (evidenceObject.rootUrl) {
      evidenceObject.timestamp = ts;
      evidenceObject.rootUrl = rootU;
      evidenceObject.parentCompany = parent;

      function getUserData(evidenceObject) {
        if (evidenceObject.index === -1) {
          userData = undefined;
        } else {
          let start, end;
          [start, end] = evidenceObject.index;
          userData = evidenceObject.snippet.substring(start, end);
        }
        return userData;
      }
      /**
       * Cuts down a snippet to only include the context of where we found
       * The evidence
       *
       * @param {Evidence} evidenceObject
       * @returns {void} updates evidenceObject
       */
      function cutDownSnippet(evidenceObject) {
        if (evidenceObject.index === -1) {
          evidenceObject.snippet = null;
          getUserData(evidenceObject);
        } else {
          getUserData(evidenceObject);
          let start, end;
          [start, end] = evidenceObject.index;
          const snipLength = evidenceObject.snippet.length;

          const frontBuffer = start < 250 ? start : 250;
          const endBuffer = end + 250 < snipLength ? 250 : snipLength - end - 1;

          evidenceObject.snippet = evidenceObject.snippet.substring(
            start - frontBuffer,
            end + endBuffer
          );
          evidenceObject.index = [frontBuffer, frontBuffer + end - start];
        }
      }
      var dataTypes = {
        zipCode: "<TARGET_ZIP>",
        city: "<TARGET_CITY>",
        region: "<TARGET_REGION>",
      };
      var corTypes = {
        lat: "<TARGET_LAT>",
        lng: "<TARGET_LNG>",
      };

      function addStart(type, string) {
        return type + " ___ " + string;
      }

      /**
       * @param {string} str
       * @param {string} dataTy
       * @param {any} userData
       * @param {string} loc
       * @returns {string}
       */
      function formatString(str, dataTy, userData, loc) {
        // if simple RE, then replace
        if (dataTy in dataTypes) {
          let MlString = str.replace(userData, dataTypes[dataTy]);
          return addStart(dataTy, MlString);
        }
        // otherwise do more complicated coordinate replace (see below)
        return replaceCoors(str, loc, userData);
      }

      /**
       * @param {string} str str we're operating on
       * @param {string} latLng either "lat" or "lng"
       * @param {number} userData
       * @returns {string}
       */
      function replaceCoors(str, latLng, userData) {
        // loop to replace floating points that are within 1.0 of the users lat/lng
        var replaced = true;
        while (replaced) {
          replaced = false;
          const matches = str.matchAll(/\D\d{1,3}\.\d{1,10}/g);
          const matchArr = Array.from(matches);

          for (const match of matchArr) {
            if (match.index) {
              const startIndex = match.index + 1;
              const endIndex = startIndex + match[0].length - 1;
              const asFloat = parseFloat(str.slice(startIndex, endIndex));

              // replace either lat or lng with generic. If we replace, start loop over
              if (
                latLng == "lat" &&
                Math.abs(Math.abs(userData) - asFloat) < 1
              ) {
                var MlString = str
                  .slice(0, startIndex)
                  .concat(corTypes["lat"])
                  .concat(str.slice(endIndex));
                replaced = true;
                return addStart(latLng, MlString);
              }
              if (
                latLng == "lng" &&
                Math.abs(Math.abs(userData) - asFloat) < 1
              ) {
                var MLstring = str
                  .slice(0, startIndex)
                  .concat(corTypes["lng"])
                  .concat(str.slice(endIndex));
                replaced = true;
                return addStart(latLng, MLstring);
              }
            }
          }
          // return addStart(latLng, MlString);
        }
        // Will never happen
        return "";
      }

      /**
       * @param {string} strReq
       * @param {number} stIdx
       * @param {number} endIdx
       * @returns {boolean}
       */
      function svgCheck(strReq, stIdx, endIdx) {
        var begin =
          stIdx < 400
            ? strReq.slice(0, endIdx)
            : strReq.slice(stIdx - 400, endIdx);
        var end =
          endIdx + 400 < strReq.length
            ? strReq.slice(endIdx, endIdx + 400)
            : strReq.slice(endIdx, strReq.length);
        var full = begin.concat(end);
        var SVG = [...full.matchAll(/svg/gi)];
        var path = [...full.matchAll(/path/gi)];
        var nums = [...full.matchAll(/\d{2,5}/gm)];
        var dash = [...full.matchAll(/[-|.]{1,5}/gm)];
        if (
          SVG.length + path.length == 0 &&
          nums.length < 100 &&
          dash.length < 100
        ) {
          return true;
        }
        return false;
      }

      cutDownSnippet(evidenceObject);

      if (evidenceObject.snippet != null) {
        if (
          [
            typeEnum.city,
            typeEnum.fineLocation,
            typeEnum.coarseLocation,
            typeEnum.region,
            typeEnum.zipCode,
          ].includes(evidenceObject.typ)
        ) {
          if (
            svgCheck(
              evidenceObject.snippet,
              evidenceObject.index[0],
              evidenceObject.index[1]
            ) &&
            evidenceObject.permission == "location"
          ) {
            // not an svg, continue with check
            var formattedString = formatString(
              evidenceObject.snippet,
              evidenceObject.typ,
              userData,
              evidenceObject.loc
            );
            if ((await useModel(formattedString)) === false) {
              return new Promise(function (res, rej) {
                res(evidence);
              });
            }
          } else {
            // svg, terminate processes
            return new Promise(function (res, rej) {
              res(evidence);
            });
          }
        }
      }

      let keys = Object.keys(evidenceObject);
      for (let key of keys) {
        // looking for null, undefined, NaN, empty string (""), 0, false
        if (!evidenceObject[key] && typeof evidenceObject[key] != "boolean") {
          delete evidenceObject[key];
        }
      }
      return new Promise(function (res, rej) {
        res(updateFetchedDict(evidence, evidenceObject));
      });
    }
    return new Promise(function (res, rej) {
      res(evidence);
    });
  }

  // update the fetched evidence dict with each piece of evidence we have for this request
  for (let evidenceObj of evidenceToAdd) {
    evidence = await unpackAndUpdate(evidenceObj);
  }

  //@ts-ignore
  if (browser.runtime.getURL("").includes(rootUrl)) {
    return new Promise(function (resolve, reject) {
      resolve("whitelist ipinfo");
    });
  }
  //final return statement
  return new Promise(async function (resolve, reject) {
    await evidenceKeyval.set(rootUrl, evidence);
    resolve("set");
  });
}
