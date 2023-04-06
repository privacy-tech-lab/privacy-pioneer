/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import {
  regexSearch,
  coordinateSearch,
  locationKeywordSearch,
  ipSearch,
  encodedEmailSearch,
} from "./searchFunctions.js";
import { permissionEnum, typeEnum } from "../classModels.js";

/**
 * This function runs all of the apporpriate analysis functions for cookies.
 * It returns an empty array if no evidence is found. Else an array of arrays containing the
 * information to be added.
 *
 * Defined in scanCookies.js
 *
 * Used in analyze.js
 *
 * @param cookies A list of cookies to be analyzed
 * @param rootUrl Host site
 * @param reqUrl Requesting site
 * @param userData
 */
function getAllEvidenceForCookies(cookies, rootUrl, reqUrl, userData) {
  // this 0, 1, 2 comes from the structure of the importData function
  // location we obtained from google maps API
  const loc = userData[0];
  // {phone #s, emails, location elements entered by the user, fingerprinting keywords}
  const networkKeywords = userData[1];

  const currIpInfo = userData[5];

  var evidenceArr = [];

  // we don't surface these evidences, so skip.
  if (typeof rootUrl == "undefined") {
    return evidenceArr;
  }

  /**
   * We call this function to appropriately build the result list from our search functions.
   * We don't add non-findings, and we unpack multi-findings
   *
   * Defined, used in scanHTTP.js
   *
   * @param {Array<Array>} resArr The search function result
   * @param {Array} arr The array of results we are building for this HTTP request
   * @returns {Void} Updates the array of evidence, defined outside of this function
   */
  function executeAndPush(resArr, arr = evidenceArr) {
    if (typeof resArr == "undefined") {
      return;
    }
    if (resArr.length == 0) {
      return;
    }
    for (const evList of resArr) {
      evList.cookie = true;
      arr.push(evList); // push the evidence to the arr
    }
  }

  cookies.forEach((cookie) => {
    let cookieString = cookie.value;
    runWatchlistAnalysis(cookieString);
    runStandardAnalysis(cookieString);
  });

  return evidenceArr;

  /**
   * Function to call watchlist search functions.
   * @returns {Void} Nothing. Updates evidenceArr as necessary
   */
  function runWatchlistAnalysis(cookieString) {
    if (!permissionEnum.personal in networkKeywords) {
      return;
    }

    const watchlistDict = networkKeywords[permissionEnum.personal];

    if (typeEnum.phoneNumber in watchlistDict) {
      watchlistDict[typeEnum.phoneNumber].forEach((number) => {
        executeAndPush(
          regexSearch(
            cookieString,
            number,
            rootUrl,
            reqUrl,
            typeEnum.phoneNumber
          )
        );
      });
    }
    if (typeEnum.emailAddress in watchlistDict) {
      executeAndPush(
        encodedEmailSearch(cookieString, networkKeywords, rootUrl, reqUrl)
      );

      watchlistDict[typeEnum.emailAddress].forEach((email) => {
        executeAndPush(
          regexSearch(
            cookieString,
            email,
            rootUrl,
            reqUrl,
            typeEnum.emailAddress
          )
        );
      });
    }

    if (typeEnum.userKeyword in watchlistDict) {
      watchlistDict[typeEnum.userKeyword].forEach((keyword) => {
        executeAndPush(
          regexSearch(
            cookieString,
            keyword,
            rootUrl,
            reqUrl,
            typeEnum.userKeyword
          )
        );
      });
    }

    if (typeEnum.ipAddress in watchlistDict) {
      watchlistDict[typeEnum.ipAddress].forEach((ip) => {
        executeAndPush(ipSearch(cookieString, ip, rootUrl, reqUrl));
      });
    }
  }

  /**
   * Function to call generalized search functions
   * @returns {Void} Nothing. Updates evidenceArr as necessary
   */
  function runStandardAnalysis(cookieString) {
    // if this value is 0 the client likely denied location permission
    // or they could be on Null Island in the middle of the Gulf of Guinea
    if (loc[0] != 0 && loc[1] != 0) {
      executeAndPush(coordinateSearch(cookieString, loc, rootUrl, reqUrl));
    }
    // search for location data if we have it
    if (permissionEnum.location in networkKeywords) {
      executeAndPush(
        locationKeywordSearch(
          cookieString,
          networkKeywords[permissionEnum.location],
          rootUrl,
          reqUrl
        )
      );
    }
  }
}

export { getAllEvidenceForCookies };
