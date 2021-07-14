/*
searchFunctions.js
================================================================================
- searchFunctions.js contains all functions used to search through network
requests
*/
import { Request, typeEnum, permissionEnum, Evidence } from "../classModels.js"
import { regexSpecialChar, escapeRegExp } from "../utility/regexFunctions.js"
import { getHostname } from "../utility/util.js"

/**
 * Iterates through the user's location elements and adds exact text matches to evidence. 
 * Evidence will be added with permission location and the type of the found evidence (city or zip for example)
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
      let res = regexSearch(strReq, value, rootUrl, reqUrl, k, permissionEnum.location)
      if (res.length != 0) output.push(res[0]);
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
 * @param {Request} request An HTTP request
 * @param {object} urls The disconnect JSON
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
function urlSearch(strReq, rootUrl, reqUrl, classifications) {
  var output = []
  let firstPartyArr = classifications.firstParty;
  let thirdPartyArr = classifications.thirdParty;

  function loopThroughClassificationArray(arr) {
    for (let url of arr) {
      if (url in classificationTransformation) {
        let p, t;
        [p, t] = classificationTransformation[url];
        output.push([p, rootUrl, strReq, reqUrl, t, undefined])
      }
    }
  }

  loopThroughClassificationArray(firstPartyArr);
  loopThroughClassificationArray(thirdPartyArr);
  return output
  }

/**
 * Iterates through the disconnect list and adds evidence accordingly. 
 * Only iterating through the fingerprintingInvasive category right now.
 * 
 * @param {Request} request An HTTP request
 * @param {object} urls The disconnect JSON
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
 function disconnectFingerprintSearch(request, urls) {

  var output = []

  /**
   * adds a piece of evidence from the disconnect JSON to allign with our permission type schema.
   * @param {string} perm permission from permissionEnum
   * @param {string} type type from typeEnum
   * @returns {void} Nothing. Adds to evidence list
   */
  function addDisconnectEvidence(perm, type) {
    output.push([perm, request.details["originUrl"], "null", request.details["url"], type, undefined])
  }
  
  // The fingerprintingInvasive category is the only one we are traversing.
  const cat = 'fingerprintingInvasive'
  var fpInv = urls["categories"][cat]
  for (var j = 0; j < fpInv.length; j++) {
    var obj = urls["categories"][cat][j]
    var indivKey = Object.keys(obj)
    var nextKey = Object.keys(urls["categories"][cat][j][indivKey])
    for (var k = 0; k < nextKey.length; k++) {
      var urlLst = urls["categories"][cat][j][indivKey][nextKey[k]]
      var url = request.details["url"]
      // if there are multiple URLs on the list we go here
      for (var u = 0; u < urlLst.length; u++) {
        if (url.includes(urlLst[u])) {
            addDisconnectEvidence(permissionEnum.tracking, typeEnum.fingerprinting);
        }
      }
    }
  }
  return output
}


/**
 * Searches an HTTP request for a users lattitude and longitude. Uses regular expression patterns to look for floating point patterns.
 * We only add evidence if we find a .1 distance from both the 
 * lattitude and the longitude within 250 characters of each other in the request
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
  let floatReg = /\D\d{2,3}\.\d{2,10}/g
  const matches = strReq.matchAll(floatReg)
  const matchArr = Array.from(matches)
  // not possible to have pair without at least 2 matches
  if ( matchArr.length < 2 ) { return output }

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
        output.push([permissionEnum.location, rootUrl, strReq, reqUrl, typeEnum.tightLocation, [startIndex, endIndex]])
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
  return output
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
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 *
 */
function regexSearch(strReq, keyword, rootUrl, reqUrl, type, perm = permissionEnum.watchlist ) {
  var output = []
  let fixed = escapeRegExp(keyword)
  let re = new RegExp(`${fixed}`, "i");
  let res = strReq.search(re)
  if (res != -1) { output.push([perm, rootUrl, strReq, reqUrl, type, [res, res + keyword.length]]) }
  return output
}

/**
 * 
 * @param {string} strReq The request as a string
 * @param {Dict} networkKeywords A dictionary containing fingerprinting keywords
 * @param {string} rootUrl The rootUrl as a string
 * @param {string} reqUrl The requestUrl as a string
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 * Searches a request for the fingerprinting elements populated in the networkKeywords it is passed. These elements can be found in the keywords JSON
 */
function fingerprintSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  var output = []
  const fpElems = networkKeywords[permissionEnum.tracking][typeEnum.fingerprinting]
  for (const [k, v] of Object.entries(fpElems)) {
    for (const keyword of v){
      const idxKeyword = strReq.indexOf(keyword);
      if (idxKeyword != -1){
        output.push([permissionEnum.tracking, rootUrl, strReq, reqUrl, typeEnum.fingerprinting, [idxKeyword, idxKeyword + keyword.length]]);
        break;
      }
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
    let searchIndex = strReq.indexOf(url)
    if (searchIndex != -1) {
      let reqUrlIndex = strReq.indexOf(reqUrl)
      // preference to show the reqUrl on the front end
      if (reqUrlIndex != -1) {
        output.push([permissionEnum.tracking, rootUrl, strReq, reqUrl, typeEnum.trackingPixel, [reqUrlIndex, reqUrlIndex + reqUrl.length]])
      }
      // otherwise show the url from the pixel list on the front end
      else {
        output.push([permissionEnum.tracking, rootUrl, strReq, reqUrl, typeEnum.trackingPixel, [searchIndex, searchIndex + url.length]])
      }  
    }
  }
  return output
}

/**
 * Dynamic Pixel search function.
 * Looks for height, width = 1, 'pixel' and '?' in request URL
 * 
 * @param {string} strReq The request as a string
 * @param {string} reqUrl The requestUrl as a string
 * @param {string} rootUrl The rootUrl as a string
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
    output.push([permissionEnum.tracking, rootUrl, strReq, reqUrl, typeEnum.trackingPixel, [reqUrlIndex, reqUrlIndex + reqUrl.length]])
  }
}

/**
 * ipSearch first checks if we have a different rootUrl and reqUrl. If we do, it does a standard text search for the given ip.
 * 
 * @param {string} strReq The request as a string
 * @param {string} ip An ip address as a string
 * @param {string} rootUrl Root url as a string
 * @param {string} reqUrl The request url as a string
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
function ipSearch(strReq, ip, rootUrl, reqUrl) {

  if ( rootUrl === undefined || reqUrl === undefined ) { return }
  // we're only interested in third party requests
  if ( getHostname(rootUrl) === getHostname(reqUrl) ) {
    return
  }

  //otherwise just do a standard text search
  return regexSearch(strReq, ip, rootUrl, reqUrl, typeEnum.ipAddress, permissionEnum.tracking) 
}


/**
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
      let fixed = escapeRegExp(encodedEmail)
      let re = new RegExp(`${fixed}`, "i");
      let output = strReq.search(re)
      if (output != -1) {
       output.push([permissionEnum.watchlist, rootUrl, strReq, reqUrl, typeEnum.encodedEmail, [output, output+encodedEmail.length], email])
      }
    })
  })
  return output
}

export { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch, fingerprintSearch, ipSearch, pixelSearch, disconnectFingerprintSearch, encodedEmailSearch, dynamicPixelSearch }
