/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

/*
searchFunctions.js
================================================================================
- searchFunctions.js contains all functions used to search through network
requests
*/
import { Request, typeEnum, permissionEnum } from "../classModels.js"
import { regexSpecialChar, escapeRegExp } from "../utility/regexFunctions.js"
import { getHostname } from "../utility/util.js"
import { watchlistKeyval } from "../../../libs/indexed-db/openDB.js"
import { watchlistHashGen, createEvidenceObj } from "../utility/util.js"
import { COORDINATE_PAIR_DIST, FINE_LOCATION_BOUND, COARSE_LOCATION_BOUND } from "../constants.js"


/**
 * Iterates through the user's location elements and adds exact text matches to evidence. 
 * Evidence will be added with permission location and the type of the found evidence (city or zip for example)
 * 
 * Defined in searchFunctions.js
 * 
 * Used in scanHTTP.js
 * 
 * @param {string} strReq 
 * @param {Dict<typeEnum>} locElems 
 * @param {string} rootUrl 
 * @param {string} reqUrl 
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
function locationKeywordSearch(strReq, locElems, rootUrl, reqUrl) {
  
  var output = []
  for (const [k, v] of Object.entries(locElems)) {
    // every entry is an array, so we iterate through it.
    for (let value of v) {
      const res = regexSearch(strReq, value, rootUrl, reqUrl, k, permissionEnum.location)
      if (res.length != 0) {
        output.push(res[0]); // this comes in as an Array that will always be length one
      }
    }
  }
  return output
}

/**
 * @type {Dict}
 * used by the addDisconnectEvidence function to translate the disconnect JSON into our permission type schema.
 * Maps strings to array of length 2.
 */
const classificationTransformation = { 
  "tracking": [permissionEnum.tracking, typeEnum.analytics],
  "tracking_ad": [permissionEnum.monetization, typeEnum.advertising], 
  "tracking_analytics": [permissionEnum.monetization, typeEnum.analytics],
  "fingerprinting": [permissionEnum.tracking, typeEnum.fingerprinting],
  "fingerprinting_content": [permissionEnum.tracking, typeEnum.fingerprinting],
  "tracking_social": [permissionEnum.monetization, typeEnum.social],
  }
                            
/**
 * Iterates through the disconnect list and adds evidence accordingly. It creates evidence with the category of the disconnect JSON as both the permission
 * and the type.
 * 
 * Defined in searchFunctions.js
 * 
 * Used in scanHTTP.js
 * 
 * @param {Request} request An HTTP request
 * @param {object} urls The disconnect JSON
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
function urlSearch(rootUrl, reqUrl, classifications) {
  var output = []
  let firstPartyArr = classifications.firstParty;
  let thirdPartyArr = classifications.thirdParty;

  function loopThroughClassificationArray(arr) {
    for (let classification of arr) {
      if (classification in classificationTransformation) {
        let p, t;
        [p, t] = classificationTransformation[classification];
        output.push(createEvidenceObj(p, rootUrl, null, reqUrl, t, undefined))
      }
    }
  }

  loopThroughClassificationArray(firstPartyArr);
  loopThroughClassificationArray(thirdPartyArr);
  return output
  }

/**
 * Searches an HTTP request for a users latitude and longitude. Uses regular expression patterns to look for floating point patterns.
 * We only add evidence if we find a .1 distance from both the 
 * latitude and the longitude within 250 characters of each other in the request
 * 
 * Defined in searchFunctions.js
 * 
 * Used in scanHTTP.js
 * 
 * @param {string} strReq The HTTP request as a string 
 * @param {Array<number>} locData The coordinates of the user
 * @param {string} rootUrl The rootUrl as a string
 * @param {string} reqUrl The requestUrl as a string
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 * 
 */
function coordinateSearch(strReq, locData, rootUrl, reqUrl) {
  var output = []
  const lat = locData[0]
  const lng = locData[1]
  const absLat = Math.abs(lat)
  const absLng = Math.abs(lng)

  // floating point regex non-digit, then 2-3 digits (should think about 1 digit starts later, this reduces matches a lot and helps speed), then a ".", then 2 to 10 digits, g is global flag
  let floatReg = /\D\d{1,3}\.\d{1,10}/g
  const matches = strReq.matchAll(floatReg)
  const matchArr = Array.from(matches)

  // not possible to have pair without at least 2 matches
  if ( matchArr.length < 2 ) { return output }

  /**
   * Takes in a match from the regular expression and keeps only the parts which can be parsed
   * by parseFloat. Returns a float.
   * 
   * Defined, used in searchFunctions.js
   * 
   * @param {string} match
   * @returns {float} the match as a float
   */
  function cleanMatch(match) {
    var cleaned = []
    let i = 0
    while ( i < match.length ) {
      const char = match[i]
      if ( (char >= '0' && char <= '9') || char == '\.' ) {
        cleaned.push(char)
      }
      i += 1
    }
    return parseFloat(cleaned.join(''));
  }

  /**
   * If we find latitude, we search for longitude and vice versa
   * 
   * Defined, used in searchFunctions.js
   * 
   * @param {Array<Iterator>} matchArr An array with possible floating point numbers
   * @param {number} goal Either a latitude or a longitude.
   * @param {number} arrIndex An index of where in matchArr the previous coordinate was found
   * @param {number} matchIndex The index in the original request string of the first coordinate.
   * @returns {number} The next index to be searched. Or the length of the array if a pair is found (This will terminate the outer while loop).
   */
  function findPair(matchArr, goal, arrIndex, matchIndex, deltaBound, typ) {
    // we want lat and lng to be in close proximity
    let bound = matchIndex + COORDINATE_PAIR_DIST
    let j = arrIndex + 1
    while ( j < matchArr.length ) {
      let match = matchArr[j]
      let startIndex = match.index + 1
      let endIndex = startIndex + match[0].length - 1
      const asFloat = cleanMatch(match[0])

      // potential is too far away, move on
      if (startIndex > bound) { return arrIndex + 1 }

      let delta = Math.abs(asFloat - goal)
      if (delta < deltaBound) {
        output.push(createEvidenceObj(permissionEnum.location, rootUrl, strReq, reqUrl, typ, [startIndex, endIndex]))
        // if we find evidence for this request we return an index that will terminate the loop
        return matchArr.length
      }
      j += 1
    }
    return arrIndex + 1
  }

  /**
   * Goes through the match array and searches for matches within a delta bound.
   * 
   * Defined, used in searchFunctions.js
   * 
   * @param {number} deltaBound Bound for finding matches
   * @param {string} typ What typeEnum maps to the passed bound
   */
  function iterateMatchArray(deltaBound, typ) {
    var i = 0
    // matchArr is sorted by index, so we only need to look at elements to the right of a potential match
    while (i < matchArr.length) {
      let match = matchArr[i]
      let startIndex = match.index + 1
      const asFloat = cleanMatch(match[0])

      let deltaLat = Math.abs(asFloat - absLat)
      let deltaLng = Math.abs(asFloat - absLng)

      if (deltaLat < deltaBound) { i = findPair(matchArr, absLng, i, startIndex, deltaBound, typ) }
      else if (deltaLng < deltaBound ) { i = findPair(matchArr, absLat, i, startIndex, deltaBound, typ) }
      else { i += 1}
    }
  }

  iterateMatchArray(FINE_LOCATION_BOUND, typeEnum.fineLocation) // we define tight location as within .1 degree lng/lat. See constants.js for exp
  iterateMatchArray(COARSE_LOCATION_BOUND, typeEnum.coarseLocation) // we define coarse location as within 1 degree lng/lat. See constants.js for exp
  
  return output
}



/**
 * Searches a request using regular expressions. Case insensitive. Can process special characters.
 * 
 * Defined in searchFunctions.js
 * 
 * Used in scanHTTP.js
 * 
 * @param {string} strReq The request as a string
 * @param {string} keyword The keyword as a string
 * @param {string} rootUrl The rootUrl as a string
 * @param {string} reqUrl The requestUrl as a string
 * @param {string} type From typeEnum
 * @param {string} perm From permissionEnum
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 *
 */
function regexSearch(strReq, keywordObj, rootUrl, reqUrl, type, perm = permissionEnum.watchlist ) {

  const keywordIDWatch = keywordObj.keywordHash
  const keyword = keywordObj.keyword
  var output = []
  if (typeof keyword == 'string'){
    let fixed = escapeRegExp(keyword)
    const re = new RegExp(`${fixed}`, "i");
    const res = strReq.search(re)
    if (res != -1) { output.push(createEvidenceObj(perm, rootUrl, strReq, reqUrl, type, [res, res + keyword.length], keywordIDWatch)) }
  } 
  else if (keyword instanceof RegExp) {
    const res = strReq.match(keyword)
    if (res != null) {
      var len = res[0].length
      var startIndex = res.index
      // update indexes based on how the regex was structured
      if (type == typeEnum.zipCode) {
        startIndex += 1
        len -= 2
      }
      if (rootUrl) { output.push(createEvidenceObj(perm, rootUrl, strReq, reqUrl, type, [startIndex, startIndex + len], keywordIDWatch)) }
    }
  }
  return output
}

/**
 * Searches a request for the fingerprinting elements populated in the networkKeywords it is passed. These elements can be found in the keywords JSON
 * 
 * Defined in searchFunctions.js
 * 
 * Used in scanHTTP.js
 * 
 * @param {string} strReq The request as a string
 * @param {Dict} networkKeywords A dictionary containing fingerprinting keywords
 * @param {string} rootUrl The rootUrl as a string
 * @param {string} reqUrl The requestUrl as a string
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 * 
 */
function fingerprintSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  var output = []
  const fpElems = networkKeywords[permissionEnum.tracking][typeEnum.fingerprinting]
  for (const keyword of fpElems){
    const idxKeyword = strReq.indexOf(keyword);
    if (idxKeyword != -1){
      output.push(createEvidenceObj(permissionEnum.tracking, rootUrl, strReq, reqUrl, typeEnum.fingerprinting, [idxKeyword, idxKeyword + keyword.length]));
      break;
    }
  }
  return output
}

/**
 * Pixel search looks iterates through our list of pixel URLS from keywords.JSON. This function is only called on requests with type image and different root/req Urls
 * It will index the evidence as the requestUrl if it can find it in the strReq (which it always should). 
 * This is because most pixels contain data encoded into the reqUrl
 * If for some reason this doesn't work, it will choose the index of the url from the list.
 * 
 * Defined in searchFunctions.js
 * 
 * Used in scanHTTP.js
 * 
 * @param {string} strReq The request as a string
 * @param {Dict} networkKeywords A dictionary containing the pixel URLs
 * @param {string} rootUrl The rootUrl as a string
 * @param {string} reqUrl The requestUrl as a string
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
function pixelSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  var output = []
  const pixelUrls = networkKeywords[permissionEnum.tracking][typeEnum.trackingPixel]
  for (let url of pixelUrls) {
    let searchIndex = reqUrl.indexOf(url)
    if (searchIndex != -1) {
        let reqUrlIndex = strReq.indexOf(reqUrl)
        output.push(createEvidenceObj(permissionEnum.tracking, rootUrl, strReq, reqUrl, typeEnum.trackingPixel, [reqUrlIndex, reqUrlIndex + reqUrl.length]))
    }
  }
  return output
}

/**
 * Dynamic Pixel search function.
 * Looks for height, width = 1, 'pixel' and '?' in request URL
 * 
 * Defined in searchFunctions.js
 * 
 * Used in scanHTTP.js
 * 
 * @param {string} strReq The request as a string
 * @param {string} reqUrl The requestUrl as a string
 * @param {string} rootUrl The rootUrl as a string
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
 function dynamicPixelSearch(strReq, reqUrl, rootUrl) {
  if (strReq.length > 10000) {return}
  
  const heightWidth = /height\D{1,8}[0,1]\D{1,20}width\D{1,8}[0,1]\D/g
  const widthHeight = /width\D{1,8}[0,1]\D{1,20}height\D{1,8}[0,1]\D/g

  let resOne = strReq.search(heightWidth)
  let resTwo = strReq.search(widthHeight)

  let pix = reqUrl.search(/pixel/)
  let qSearch = reqUrl.search(/\?/)

  var output = []

  if (resOne + resTwo != -2 && pix != -1 && qSearch != -1){
    let reqUrlIndex = strReq.indexOf(reqUrl)
    output.push(createEvidenceObj(permissionEnum.tracking, rootUrl, strReq, reqUrl, typeEnum.possiblePixel, [reqUrlIndex, reqUrlIndex + reqUrl.length]))
  }
  return output
}

/**
 * ipSearch first checks if we have a different rootUrl and reqUrl. If we do, it does a standard text search for the given ip.
 * 
 * Defined in searchFunctions.js
 * 
 * Used in scanHTTP.js
 * 
 * @param {string} strReq The request as a string
 * @param {string} ip An ip address as a string
 * @param {string} rootUrl Root url as a string
 * @param {string} reqUrl The request url as a string
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
function ipSearch(strReq, ipObj, rootUrl, reqUrl) {

  if ( rootUrl === undefined || reqUrl === undefined ) { return }
  // we're only interested in third party requests
  if ( getHostname(rootUrl) === getHostname(reqUrl) ) {
    return
  }

  return regexSearch(strReq, ipObj, rootUrl, reqUrl, typeEnum.ipAddress, permissionEnum.tracking) 
}


/**
 * Searches for encoded emails within HTTP requests. Type will be encodedEmail. Also adds an extraDetail of original email address
 * 
 * Defined in searchFunctions.js
 * 
 * Used in scanHTTP.js
 * 
 * @param {string} strReq The request as a string
 * @param {Dict} networkKeywords A dictionary containing the encoded email object
 * @param {string} rootUrl Root url as a string
 * @param {string} reqUrl The request url as a string
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
function encodedEmailSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  var output = []
  const encodedObj = networkKeywords[permissionEnum.watchlist][typeEnum.encodedEmail]
  const emails = Object.keys(encodedObj)
  emails.forEach(email => {
    let encodeLst = encodedObj[email]
    encodeLst.forEach(encodedEmail => {
      const encoded = encodedEmail.keyword
      const hashed = encodedEmail.keywordHash
      let fixed = escapeRegExp(encoded)
      let re = new RegExp(`${fixed}`, "i");
      let output = strReq.search(re)
      if (output != -1) {
       output.push(createEvidenceObj(permissionEnum.watchlist, rootUrl, strReq, reqUrl, typeEnum.encodedEmail, [output, output+encoded.length], hashed, email))
      }
    })
  })
  return output
}

export { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch, fingerprintSearch, ipSearch, pixelSearch, encodedEmailSearch, dynamicPixelSearch }
