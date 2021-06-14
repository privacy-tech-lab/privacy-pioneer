/*
searchFunctions.js
================================================================================
- searchFunctions.js contains all functions used to search through network
requests
*/
import { Request, Evidence, typeEnum, permissionEnum } from "./classModels.js"
import { openDB } from 'idb';
import { EvidenceKeyval } from "./openDB.js"

import { RegexSpecialChar, escapeRegExp } from "./regexFunctions.js"

// given a type and a permission creates a unique hash so there are no repeats
// in our indexedDB. THIS IS NOT A SECURE HASH, but rather just a quick way
// to convert a regular string into digits
// taken basically from: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
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

// code from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
export function extractHostname(url) {

    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

// takes in full url and extracts just the domain host
// code from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
export const getHostname = (url) => {
  var domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
      // domain = second to last and last domain. could be (xyz.me.uk) or (xyz.uk)
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
          //this is using a ccTLD. set domain to include the actual host name
          domain = splitArr[arrLen - 3] + '.' + domain;
      }
  }
  return domain;
}

// given the permission category, the url of the request, and the snippet
// from the request, get the current time in ms and add to our evidence list
// async because it has to wait on get from db
//
//
/* So, now the evidence looks like this:
 
  let stored = await EvidenceKeyval.get(rootUrl)

  now stored points to the nested object with our evidence at this url
  There are three levels of nesting
  1) permission level
  2) type level
  3) reqUrl level

  The evidence object is in this final reqUrl level. 
  We store a max of 5 pieces of evidence for a given permission type pair.
}
*/
async function addToEvidenceList(perm, rootU, snip, requestU, t, i) {
  
  var ts = Date.now()
  if (rootU == undefined) {
    // if the root URL is not in the request then let's just not save it
    // as we cannot be sure what domain it is actually being called from
    // we should, however, print the request to console for now just to see
    // how often this is happening
    console.log("No root URL detected for snippet:")
    console.log(perm, snip, requestU, t)
    return
  }
  
  var rootUrl = getHostname(rootU)
  var reqUrl = getHostname(requestU)

  // hacky way to deal with the way we iterate through the disconnect json
  if (perm.includes("fingerprint")) { perm = "fingerprinting"}
  if (perm.includes("advertising")) { t = "analytics" }
  if (perm.includes("analytics")) { perm = "advertising" }

  // snippet = code snippet we identified as having sent personal data
  // typ = type of data identified
  // index = [start, end] indexes for snippet
  const e = new Evidence( {
    timestamp: ts,
    permission: perm,
    rootUrl: rootUrl,
    snippet: snip,
    requestUrl: requestU,
    typ: t,
    index: i
  } )

    // currently stored evidence at this domain
    var evidence = await EvidenceKeyval.get(rootUrl)

    // if we don't have evidence yet, we initialize it as an empty dict
    if (evidence === undefined) {
      evidence = {}
    }

  // if we have this rootUrl in evidence already we check if we already have store_label
  if (Object.keys(evidence).length !== 0) {
    if (perm in evidence) { 
      // if type is in the permission
      if (t in evidence[perm]) {
        // if we have less than 5 different reqUrl's for this permission and this is a unique reqUrl, we save the evidence
        if ((Object.keys(evidence[perm][t]).length < 4) && !(reqUrl in evidence[perm][t] )) {
          evidence[perm][t][reqUrl] = e
          EvidenceKeyval.set(rootUrl, evidence)
        }
      }
      else { // we don't have this type yet, so we initialize it
        evidence[perm][t] = {}
        evidence[perm][t][reqUrl] = e
        EvidenceKeyval.set(rootUrl, evidence)
      }
    }
    else { // we don't have this permission yet so we initialize
      evidence[perm] = {}
      
      // init dict for permission type pair
      evidence[perm][t] = {}

      evidence[perm][t][reqUrl] = e
      EvidenceKeyval.set(rootUrl, evidence)
    }

  }
  // we have don't have this rootUrl yet. So we init evidence at this url
  else {
    evidence[perm] = {}
    evidence[perm][t] = {}
    evidence[perm][t][reqUrl] = e
    EvidenceKeyval.set(rootUrl, evidence)
  }
}


// Look in request for keywords from list of keywords built from user's
// location and the Google Maps geocoding API
function locationKeywordSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  var locElems = networkKeywords[permissionEnum.location]
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
  var lat = locData[0]
  var lng = locData[1]
  var absLat = Math.abs(lat)
  var absLng = Math.abs(lng)

  // floating point regex non-digit, then 2-3 digits (should think about 1 digit starts later, this reduces matches a lot and helps speed), then a ".", then 4 to 10 digits, g is global flag
  let floatReg = /\D\d{2,3}\.\d{4,10}/g
  const matches = strReq.matchAll(floatReg)

  let foundLat = false
  let foundLng = false
  let start = undefined
  let end = undefined

  let foundPreciseLat = false
  let foundPreciseLng = false
  let start_ = undefined
  let end_ = undefined


  for (const match of matches) {
    //we take this substring because of non-digit in regex
    let potCoor = match[0].substring(1)
    let startIndex = match.index
    let endIndex = startIndex + potCoor.length

    const asFloat = parseFloat(potCoor)
    const deltaLat = Math.abs(asFloat - absLat)
    const deltaLng = Math.abs(asFloat - absLng)

    if (deltaLat < 1) {
      foundLat = true
      start = startIndex
      end = endIndex
      
    }
    if (deltaLng < 1) {
      foundLng = true
      start = startIndex
      end = endIndex
    }

    if (deltaLat < .1) {
      foundPreciseLat = true
      start_ = startIndex
      end_ = endIndex
    }

    if (deltaLng < .1) {
      foundPreciseLng = true
      start_ = startIndex
      end_ = endIndex
    }
  }

  if (foundPreciseLat && foundPreciseLng) {
    addToEvidenceList(permissionEnum.location, rootUrl, strReq, reqUrl, typeEnum.tightLocation, [start_, end_])
    return
  }

  if (foundLat && foundLng) {
    addToEvidenceList(permissionEnum.location, rootUrl, strReq, reqUrl, typeEnum.coarseLocation, [start, end])
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