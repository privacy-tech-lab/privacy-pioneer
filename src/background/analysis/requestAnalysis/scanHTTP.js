import { regexSearch, coordinateSearch, urlSearch, disconnectFingerprintSearch, locationKeywordSearch, fingerprintSearch, ipSearch, pixelSearch, encodedEmailSearch, dynamicPixelSearch } from "./searchFunctions.js"
import { permissionEnum, typeEnum, resourceTypeEnum } from '../classModels.js'


/**
 * This function runs all of the apporpriate analysis functions for an HTTP request.
 * It returns an empty array if no evidence is found. Else an array of arrays containing the
 * information to be added.
 * 
 * @param request An HTTP Request to be analyzed
 * @param userData 
 */
function getAllEvidenceForRequest(request, userData) {

    const rootUrl = request.details["originUrl"]
    const reqUrl = request.details["url"]

    // this 0, 1, 2 comes from the structure of the importData function
    // location we obtained from google maps API
    const loc = userData[0]
    // {phone #s, emails, location elements entered by the user, fingerprinting keywords}
    const networkKeywords = userData[1]
    // websites that have identification objectives
    const urls = userData[2]

    const strRequest = JSON.stringify(request);

    var evidenceArr = [];

    /**
     * We call this function to appropriately build the result list from our search functions.
     * We don't add non-findings, and we unpack multi-findings
     * 
     * @param {Array<Array>} f The search function result 
     * @param {Array} arr The array of results we are building for this HTTP request 
     * @returns 
     */
    function executeAndPush(f, arr = evidenceArr) {
        if (typeof f == 'undefined') {return}
        if (f.length == 0) {return}
        for (const evList of f) {
            arr.push(evList); // push the evidence to the arr
        }
    }

    // if this value is 0 the client likely denied location permission
    // or they could be on Null Island in the middle of the Gulf of Guinea
    if (loc[0] != 0 && loc[1] != 0) {
        executeAndPush(coordinateSearch(strRequest, loc, rootUrl, reqUrl))
      }
    // search for location data if we have it
    if ( permissionEnum.location in networkKeywords) {
        executeAndPush(locationKeywordSearch(strRequest, networkKeywords[permissionEnum.location], rootUrl, reqUrl))
    }
    // search for personal data from user's watchlist
    if ( permissionEnum.watchlist in networkKeywords) {
        if ( typeEnum.phoneNumber in networkKeywords[permissionEnum.watchlist] ) {
          networkKeywords[permissionEnum.watchlist][typeEnum.phoneNumber].forEach( number => {
            executeAndPush(regexSearch(strRequest, number, rootUrl, reqUrl, typeEnum.phoneNumber))
          })
        }
        if ( typeEnum.emailAddress in networkKeywords[permissionEnum.watchlist] ) {
            executeAndPush(encodedEmailSearch(strRequest, networkKeywords, rootUrl, reqUrl))
           
          networkKeywords[permissionEnum.watchlist][typeEnum.emailAddress].forEach( email => {
            executeAndPush(regexSearch(strRequest, email, rootUrl, reqUrl, typeEnum.emailAddress))
          })
        }
  
        if ( typeEnum.userKeyword in networkKeywords[permissionEnum.watchlist] ) {
          networkKeywords[permissionEnum.watchlist][typeEnum.userKeyword].forEach ( keyword => {
            executeAndPush(regexSearch(strRequest, keyword, rootUrl, reqUrl, typeEnum.userKeyword))
          })
        }
  
        if ( typeEnum.ipAddress in networkKeywords[permissionEnum.watchlist] ) {
          networkKeywords[permissionEnum.watchlist][typeEnum.ipAddress].forEach( ip => {
            executeAndPush(ipSearch(strRequest, ip, rootUrl, reqUrl))
          })
        }
      }
  
    // search to see if the url of the root or request comes up in our services list
    executeAndPush(urlSearch(strRequest, rootUrl, reqUrl, request.urlClassification))
  
    executeAndPush(disconnectFingerprintSearch(request, urls))
  
    // search to see if any fingerprint data
    executeAndPush(fingerprintSearch(strRequest, networkKeywords, rootUrl, reqUrl))
  
    // if the request is an image or subFrame and is coming from a different url than the root, we look for our pixel URLs
    if ( (request.type == resourceTypeEnum.image || request.type == resourceTypeEnum.subFrame) && rootUrl != reqUrl ) {
        executeAndPush(pixelSearch(strRequest, networkKeywords, rootUrl, reqUrl))
        executeAndPush(dynamicPixelSearch(strRequest, reqUrl, rootUrl))
    }

    return evidenceArr
}

export { getAllEvidenceForRequest }