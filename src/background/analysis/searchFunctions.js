/*
searchFunctions.js
================================================================================
- searchFunctions.js contains all functions used to search through network
requests
*/
import { Request, typeEnum, permissionEnum, Evidence } from "./classModels.js"
import { addToEvidenceList } from "./addEvidence.js"
import { regexSpecialChar, escapeRegExp } from "./regexFunctions.js"
import { getHostname } from "./util.js"


/**
 * Iterates through the user's location elements and adds exact text matches to evidence. 
 * Evidence will be added with permission location and the type of the found evidence (city or zip for example)
 * 
 * @param {string} strReq 
 * @param {Dict<typeEnum>} locElems 
 * @param {string} rootUrl 
 * @param {string} reqUrl 
 */
function locationKeywordSearch(strReq, locElems, rootUrl, reqUrl) {
  for (const [k, v] of Object.entries(locElems)) {
    // every entry is an array, so we iterate through it.
    for (let value of v) {
      let result_i = strReq.search(value)
      if (result_i != -1) {
      addToEvidenceList(permissionEnum.location, rootUrl, strReq, reqUrl, k, [result_i, result_i + value.length])
    }
  }
}}

/**
 * Iterates through the disconnect list and adds evidence accordingly. It creates evidence with the category of the disconnect JSON as both the permission
 * and the type.
 * 
 * @param {Request} request An HTTP request
 * @param {object} urls The disconnect JSON
 * @returns {void} Nothing. Adds to evidence when we find URL's from the disconnect list.
 */
function urlSearch(request, urls) {
  // First we can iterate through URLs
  var keys = Object.keys(urls["categories"]);
  for (var i = 0; i < keys.length; i++) {
    var cat = keys[i]
    var indivCats = urls["categories"][cat]
    for (var j = 0; j < indivCats.length; j++) {
      var obj = urls["categories"][cat][j]
      var indivKey = Object.keys(obj)
      var nextKey = Object.keys(urls["categories"][cat][j][indivKey])
      for (var k = 0; k < nextKey.length; k++) {
        var urlLst = urls["categories"][cat][j][indivKey][nextKey[k]]
        var url = request.details["url"]
        // if there are multiple URLs on the list we go here
        if (typeof urlLst === 'object') {
          for (var u = 0; u < urlLst.length; u++) {
            if (url.includes(urlLst[u])) {
              // console.log(cat + " URL detected for " + urlLst[u])
              // here originUrl is not always getting us what we want. For example it will be a google address while I'm on nyt
              addToEvidenceList(cat, request.details["originUrl"], "null", request.details["url"], cat, undefined)
            }
          }
        }
        // else we go here
        else {
          if (url.includes(urlLst)) {
            // console.log(cat + " URL detected for " + urlLst)
            // here originUrl is not always getting us what we want. For example it will be a google address while I'm on nyt
            addToEvidenceList(cat, request.details["originUrl"], "null", request.details["url"], cat, undefined)
          }
        }
      }
    }
  }
}


/**
 * Searches an HTTP request for a users lattitude and longitude. Uses regular expression patterns to look for floating point patterns.
 * 
 * @param {string} strReq The HTTP request as a string 
 * @param {Array<number>} locData The coordinates of the user
 * @param {string} rootUrl The rootUrl as a string
 * @param {string} reqUrl The requestUrl as a string
 * @returns {void} Populates the DB if a match is found. We only add evidence if we find a .1 distance from both the 
 * lattitude and the longitude within 250 characters of each other in the request
 * 
 */
function coordinateSearch(strReq, locData, rootUrl, reqUrl) {
  const lat = locData[0]
  const lng = locData[1]
  const absLat = Math.abs(lat)
  const absLng = Math.abs(lng)

  // floating point regex non-digit, then 2-3 digits (should think about 1 digit starts later, this reduces matches a lot and helps speed), then a ".", then 4 to 10 digits, g is global flag
  let floatReg = /\D\d{2,3}\.\d{4,10}/g
  const matches = strReq.matchAll(floatReg)
  const matchArr = Array.from(matches)
  // not possible to have pair without at least 2 matches
  if ( matchArr.length < 2 ) { return }

  /**
   * If we find lattitude, we search for longitude and vice versa
   * 
   * @param {Array<String>} matchArr An array with possible floating point strings
   * @param {number} goal Either a lattitude or a longitude.
   * @param {number} arrIndex An index of where in matchArr the previous coordinate was found
   * @param {number} matchIndex The index in the original request string of the first coordinate.
   * @returns {number} The next index to be searched. Or the length of the array if a pair is found (This will terminate the outer while loop).
   */
  function findPair(matchArr, goal, arrIndex, matchIndex) {
    // we want lat and lng to be in close proximity
    let bound = matchIndex + 250
    let j = arrIndex + 1
    while ( j < matchArr.length ) {
      let match = matchArr[j]
      let potCoor = match[0].substring(1)
      let startIndex = match.index
      let endIndex = startIndex + potCoor.length

      // potential is too far away, move on
      if (startIndex > bound) { return arrIndex + 1 }

      let asFloat = parseFloat(potCoor)
      let delta = Math.abs(asFloat - goal)
      if (delta < .1) {
        addToEvidenceList(permissionEnum.location, rootUrl, strReq, reqUrl, typeEnum.tightLocation, [startIndex, endIndex])
        // if we find evidence for this request we return an index that will terminate the loop
        return matchArr.length
      }
      j += 1
    }
    return arrIndex + 1
  }

  var i = 0
  // matchArr is sorted by index, so we only need to look at elements to the right of a potential match
  while (i < matchArr.length) {
    let match = matchArr[i]
    let potCoor = match[0].substring(1)
    let startIndex = match.index

    let asFloat = parseFloat(potCoor)
    let deltaLat = Math.abs(asFloat - absLat)
    let deltaLng = Math.abs(asFloat - absLng)

    if (deltaLat < .1) { i = findPair(matchArr, absLng, i, startIndex) }
    else if (deltaLng < .1 ) { i = findPair(matchArr, absLat, i, startIndex) }
    else { i += 1}
  }
}



/**
 * Searches a request using regular expressions. Case insensitive. Can process special characters.
 * 
 * @param {string} strReq The request as a string
 * @param {string} keyword The keyword as a string
 * @param {string} rootUrl The rootUrl as a string
 * @param {string} reqUrl The requestUrl as a string
 * @param {string} type From typeEnum
 * @param {string} perm From permissionEnum
 * @returns {void} Nothing. Adds evidence if found.
 *
 */
function regexSearch(strReq, keyword, rootUrl, reqUrl, type, perm = permissionEnum.personalData ) {
    let fixed = escapeRegExp(keyword)
    let re = new RegExp(`${fixed}`, "i");
    let result = strReq.search(re)
    if (result != -1) {
      {
        addToEvidenceList( perm, rootUrl, strReq, reqUrl, type, [result, result + keyword.length])
      }
    }
}

/**
 * 
 * @param {string} strReq The request as a string
 * @param {Dict} networkKeywords A dictionary containing fingerprinting keywords
 * @param {string} rootUrl The rootUrl as a string
 * @param {string} reqUrl The requestUrl as a string
 * 
 * Searches a request for the fingerprinting elements populated in the networkKeywords it is passed. These elements can be found in the keywords JSON
 */
function fingerprintSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  const fpElems = networkKeywords[permissionEnum.fingerprinting]
  for (const [k, v] of Object.entries(fpElems)) {
    for (const keyword of v){
      const idxKeyword = strReq.indexOf(keyword);
      if (idxKeyword != -1){
        addToEvidenceList(permissionEnum.fingerprinting, rootUrl, strReq, reqUrl, k, [idxKeyword, idxKeyword + keyword.length]);
        break;
      }
    }
    
  }
}

/**
 * Pixel search looks iterates through our list of pixel URLS from keywords.JSON. This function is only called on requests with type image
 * 
 * @param {string} strReq The request as a string
 * @param {Dict} networkKeywords A dictionary containing the pixel URLs
 * @param {string} rootUrl The rootUrl as a string
 * @param {string} reqUrl The requestUrl as a string
 */
function pixelSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  const pixelUrls = networkKeywords[permissionEnum.tracking][typeEnum.trackingPixel]
  for (let url of pixelUrls) {
    let searchIndex = strReq.indexOf(url)
    if (searchIndex != -1) {
      addToEvidenceList(permissionEnum.tracking, rootUrl, strReq, reqUrl, typeEnum.trackingPixel, [searchIndex, searchIndex + url.length])
    }
  }
}

/**
 * ipSearch first checks if we have a different rootUrl and reqUrl. If we do, it does a standard text search for the given ip.
 * 
 * @param {string} strReq The request as a string
 * @param {string} ip An ip address as a string
 * @param {string} rootUrl Root url as a string
 * @param {string} reqUrl The request url as a string
 * @returns {void} Nothing. Calls search function
 * 
 */
function ipSearch(strReq, ip, rootUrl, reqUrl) {

  if ( rootUrl === undefined || reqUrl === undefined ) { return }
  // we're only interested in third party requests
  if ( getHostname(rootUrl) === getHostname(reqUrl) ) {
    return
  }

  //otherwise just do a standard text search
  return regexSearch(strReq, ip, rootUrl, reqUrl, typeEnum.ipAddress)
  
}

export { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch, fingerprintSearch, ipSearch, pixelSearch }