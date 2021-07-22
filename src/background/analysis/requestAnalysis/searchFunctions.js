/*
searchFunctions.js
================================================================================
- searchFunctions.js contains all functions used to search through network
requests
*/
import { Request, typeEnum, permissionEnum, Evidence } from "../classModels.js"
import { regexSpecialChar, escapeRegExp } from "../utility/regexFunctions.js"
import { getHostname } from "../utility/util.js"
import { watchlistKeyval } from "../../../libs/indexed-db/index.js"
import { getState } from "../buildUserData/structuredRoutines.js";

function watchlistHashGen (type, keyword) {

  /**
   * Utility function to create hash for watchlist key based on keyword and type
   * This will overwrite keywords in the watchlist store that have the same keyword and type
   * Which is okay
   * from: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
   */
  function hash (str) {
    var hash = 0,
      i,
      chr;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  };

  return hash(type.concat(keyword)).toString()
}


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

  /**
   * 
   * @param {string} k The type of the evidence, as defined by typeEnum
   * @param {string|regex} value The value we searched for
   * @param {Array} res The array we are considering to be added to evidence
   * @returns The corrected array to be added to evidence
   */
  async function getVals(k, value, res){
    res = res[0]
    var watchlistVals = await watchlistKeyval.values()
    if (k==typeEnum.state){
      watchlistVals.forEach(el => {
        let stZips = getState(el[permissionEnum.location][typeEnum.zipCode])
        let st0 = stZips[0].toString()
        let st1 = stZips[1].toString()
        if (st0 == value.toString() || st1 == value.toString()){
          res[6] = el['id']
        }
      });
    }
    watchlistVals.forEach(el => {
      if (el[permissionEnum.location][k] == value){
        res[6] = el['id']
      }
    });
    return res
  }

  var output = []
  for (const [k, v] of Object.entries(locElems)) {
    // every entry is an array, so we iterate through it.
    for (let value of v) {
      var res = regexSearch(strReq, value, rootUrl, reqUrl, k, permissionEnum.location)
      if (res.length != 0) {
        getVals(k, value, res).then(fufilled => res = fufilled)
        output.push(res[0]);
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
 * @param {Request} request An HTTP request
 * @param {object} urls The disconnect JSON
 * @returns {Array<Array>|Array} An array of arrays with the search results [] if no result 
 */
function urlSearch(strReq, rootUrl, reqUrl, classifications) {
  var output = []
  let firstPartyArr = classifications.firstParty;
  let thirdPartyArr = classifications.thirdParty;

  function loopThroughClassificationArray(arr) {
    for (let classification of arr) {
      if (classification in classificationTransformation) {
        let p, t;
        [p, t] = classificationTransformation[classification];
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
  let floatReg = /\D\d{1,3}\.\d{1,10}/g
  const matches = strReq.matchAll(floatReg)
  const matchArr = Array.from(matches)

  // not possible to have pair without at least 2 matches
  if ( matchArr.length < 2 ) { return output }

  /**
   * Takes in a match from the regular expression and keeps only the parts which can be parsed
   * by parseFloat. Returns a float.
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
   * If we find lattitude, we search for longitude and vice versa
   * 
   * @param {Array<Iterator>} matchArr An array with possible floating point numbers
   * @param {number} goal Either a lattitude or a longitude.
   * @param {number} arrIndex An index of where in matchArr the previous coordinate was found
   * @param {number} matchIndex The index in the original request string of the first coordinate.
   * @returns {number} The next index to be searched. Or the length of the array if a pair is found (This will terminate the outer while loop).
   */
  function findPair(matchArr, goal, arrIndex, matchIndex, deltaBound, typ) {
    // we want lat and lng to be in close proximity
    let bound = matchIndex + 250
    let j = arrIndex + 1
    while ( j < matchArr.length ) {
      let match = matchArr[j]
      let startIndex = match.index
      let endIndex = startIndex + match[0].length
      const asFloat = cleanMatch(match[0])

      // potential is too far away, move on
      if (startIndex > bound) { return arrIndex + 1 }

      let delta = Math.abs(asFloat - goal)
      if (delta < deltaBound) {
        output.push([permissionEnum.location, rootUrl, strReq, reqUrl, typ, [startIndex, endIndex]])
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
   * @param {number} deltaBound Bound for finding matches
   * @param {string} typ What typeEnum maps to the passed bound
   */
  function iterateMatchArray(deltaBound, typ) {
    var i = 0
    // matchArr is sorted by index, so we only need to look at elements to the right of a potential match
    while (i < matchArr.length) {
      let match = matchArr[i]
      let startIndex = match.index
      const asFloat = cleanMatch(match[0])

      let deltaLat = Math.abs(asFloat - absLat)
      let deltaLng = Math.abs(asFloat - absLng)

      if (deltaLat < deltaBound) { i = findPair(matchArr, absLng, i, startIndex, deltaBound, typ) }
      else if (deltaLng < deltaBound ) { i = findPair(matchArr, absLat, i, startIndex, deltaBound, typ) }
      else { i += 1}
    }
  }

  iterateMatchArray(.1, typeEnum.tightLocation) // we define tight location as within .1 degree lng/lat
  iterateMatchArray(1, typeEnum.coarseLocation) // we define coarse location as within 1 degree lng/lat
  
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
  let keywordIDWatch = watchlistHashGen(type, keyword)
  var output = []
  if (typeof keyword == 'string'){
    let fixed = escapeRegExp(keyword)
    let re;
    let res = 0;
    if (type == typeEnum.zipCode){
      re = new RegExp(`[^0-9]${fixed}[^0-9]`)
      // since "a12345a" is a valid search, we would need to add one to the search result so that we display "12345", not "a1234"
      let zipSearch = strReq.search(re)
      res = zipSearch != -1 ? zipSearch+1 : -1
    } else {
      re = new RegExp(`${fixed}`, "i");
      res = strReq.search(re)
    }
    if (res != -1) { output.push([perm, rootUrl, strReq, reqUrl, type, [res, res + keyword.length], keywordIDWatch]) }
  } else if (keyword instanceof RegExp){
    let res = strReq.search(keyword)
    if (res != -1){
      let kString = keyword.toString()
      // The length of the keyword is relative to the length of the regex, so we need to eliminate the extra characters used by the regex
      let len = kString.length - 3;
      // If we are conditionally searching for special chars due to spaces in the state (eg. 'New York' as /New.?York/i), we should decrement length by 1
      if (kString.search(/\?/) != -1) {
        len -= 1
      }
      // If the last char in the string is not matching up with what it should be due to a lack of special char (eg. "NEWYORK/" ends with '/' instead of 'K'), decrement length by 1
      if (kString[kString.length - 3] != strReq[res + len -1]){
        len -= 1
      }
      if (rootUrl) { output.push([perm, rootUrl, strReq, reqUrl, type, [res, res + len], keywordIDWatch]) }
    }
  }
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
    output.push([permissionEnum.tracking, rootUrl, strReq, reqUrl, typeEnum.possiblePixel, [reqUrlIndex, reqUrlIndex + reqUrl.length]])
  }
  return output
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
    let emailIDWatch = watchlistHashGen(typeEnum.emailAddress, email)
    let encodeLst = encodedObj[email]
    encodeLst.forEach(encodedEmail => {
      let fixed = escapeRegExp(encodedEmail)
      let re = new RegExp(`${fixed}`, "i");
      let output = strReq.search(re)
      if (output != -1) {
       output.push([permissionEnum.watchlist, rootUrl, strReq, reqUrl, typeEnum.encodedEmail, [output, output+encodedEmail.length], emailIDWatch, email])
      }
    })
  })
  return output
}

export { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch, fingerprintSearch, ipSearch, pixelSearch, disconnectFingerprintSearch, encodedEmailSearch, dynamicPixelSearch }
