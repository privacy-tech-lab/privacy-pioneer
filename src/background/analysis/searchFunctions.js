/*
searchFunctions.js
================================================================================
- searchFunctions.js contains all functions used to search through network
requests
*/
import { Request, typeEnum, permissionEnum } from "./classModels.js"
import { addToEvidenceList } from "./addEvidence.js"
import { RegexSpecialChar, escapeRegExp } from "./regexFunctions.js"
import { getHostname } from "./util.js"


// Look in request for keywords from list of keywords built from user's
// location and the Google Maps geocoding API
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

// Gets the URL from the request and tries to match to our list of urls
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

// coordinate search looks for floating point numbers with a regular expression pattern. If we find a lat
// and lng in the same request, we submit the evidence.

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

  // when we find lat we look for lng, and vice versa
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



// passed keyword as string
// checks if the keyword appears in result
// default param is personal data but takes optional permission parameter
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

// check if something from the fingerprint lists appears in the request
function fingerprintSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  var fpElems = networkKeywords[permissionEnum.fingerprinting]
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

// ipAddress search. The distinction here is that it only runs for 3rd party requests
function ipSearch(strReq, ip, rootUrl, reqUrl, type) {

  if ( rootUrl === undefined || reqUrl === undefined ) { return }
  // we're only interested in third party requests
  if ( getHostname(rootUrl) === getHostname(reqUrl) ) {
    return
  }

  //otherwise just do a standard text search
  return regexSearch(strReq, ip, rootUrl, reqUrl, typeEnum.ipAddress)

}

export { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch, fingerprintSearch, ipSearch }