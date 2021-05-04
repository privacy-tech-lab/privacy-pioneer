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

// given a type and a permission creates a unique has so there are no repeats
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
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
          //this is using a ccTLD
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
    rootU = requestU
  }
  var rootUrl = getHostname(rootU)
  var reqUrl = getHostname(requestU)

  // hacky way to deal with the way we iterate through the disconnect json
  if (perm.includes("fingerprint")) { perm = "fingerprinting"}
  if (perm.includes("advertising")) { t = "analytics" }
  if (perm.includes("analytics")) { perm = "advertising" }

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
      if (t in evidence[perm]) {
        // if we have less than 5 different reqUrl's for this permission and this is a unique reqUrl, we save the evidence
        if (Object.keys(evidence[perm][t]).length < 5 && (!(reqUrl in evidence[perm][t])) ) {
          evidence[perm][t][reqUrl] = e
        }
      }
      else { // we don't have this type yet, so we initialize it
        evidence[perm][t] = {}
        evidence[perm][t][reqUrl] = e
      }
    }
    else { // we don't have this permission yet so we initialize
      evidence[perm] = {}
      
      // init dict for permission type pair
      evidence[perm][t] = {}

      evidence[perm][t][reqUrl] = e
      // commit to db
      EvidenceKeyval.set(rootUrl, evidence)
    }

    console.log(evidence)
  }
  // we have don't have this rootUrl yet. So we init evidence at this url
  else {
    evidence[perm] = {}
    evidence[perm][t] = {}
    evidence[perm][t][reqUrl] = e
    // commit to db
    EvidenceKeyval.set(rootUrl, evidence)
  }
}


// Look in request for keywords from list of keywords built from user's
// location and the Google Maps geocoding API
function locationKeywordSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  var locElems = networkKeywords[permissionEnum.location]
  for (const [k, v] of Object.entries(locElems)) {
    let result_i = strReq.search(v)
    if (result_i != -1) {
      addToEvidenceList(permissionEnum.location, rootUrl, strReq, reqUrl, k, [result_i, result_i + v.length])
    }
  }
}

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

// try to build floats out of HTTP request strings to find users location
function coordinateSearch(strReq, locData, rootUrl, reqUrl) {
  var lat = locData[0]
  var lng = locData[1]
  var absLat = Math.abs(lat)
  var absLng = Math.abs(lng)

  //take request => JSON and build list of decimals
  var decimalIndices = [];
  for (var i = 1; i < strReq.length - 1; i++) {
    if (strReq.charAt(i) === "." ) {
      decimalIndices.push(i);
    }
  }

  // iterate through decimals, and attempt to build float if there are numbers to either side of the decimal
  decimalIndices.forEach(index => {
    var potFloat = [];
    const oneLeft = strReq.charAt(index-1);
    const oneRight = strReq.charAt(index+1);

    if ( (!isNaN(oneLeft))  && (!isNaN(oneRight)) )
    {
      potFloat.push(oneLeft);
      potFloat.push(".");
      potFloat.push(oneRight);

      if (oneLeft != ' ' || oneRight != ' ') {
        //don't run routine when we have spaces on either side of the decimal

        const twoLeft = strReq.charAt(index-2);
        const threeLeft = strReq.charAt(index-3);
        if (!isNaN(twoLeft) && twoLeft != ' ') {
          potFloat.unshift(twoLeft);
        }
        if (!isNaN(threeLeft) && threeLeft != ' ') {
          potFloat.unshift(threeLeft);
        }

        var j = index + 2;
        var ctr = 0;
        // keep building the float as long as we haven't gone past 14 digits (rough heuristic) and we're still looking at numbers
        while ( (!isNaN(strReq.charAt(j)) && (j < strReq.length) && (ctr < 14)) ) {
          if (strReq.charAt(j) === ' ') {
            break;
          }
          potFloat.push(strReq.charAt(j));
          j = j + 1;
          ctr = ctr + 1;
        }

        //here's the potential float
        const potentialMatch = potFloat.join('');

        //heursitic that longer decimals are likely to be locations
        if (potentialMatch.length > 10) {
          const asFloat = parseFloat(potentialMatch);
          // lazy bound of 1 for matches.
          const deltaLat = Math.abs(asFloat - absLat);
          const deltaLng = Math.abs(asFloat - absLng);

          if (deltaLat < 1 && deltaLat > .1 || deltaLng < 1 && deltaLng > .1) {
            addToEvidenceList(permissionEnum.location, rootUrl, strReq, reqUrl, typeEnum.coarseLocation, [index - 3, j])
          }
          if (deltaLat < .1 && deltaLng < .1) {
            addToEvidenceList(permissionEnum.location, rootUrl, strReq, reqUrl, typeEnum.tightLocation, [index - 3, j])
        }
      }
    }
  }
 })
}

// passed keyword as string
function regexSearch(strReq, keyword, rootUrl, reqUrl, type) {
    let fixed = escapeRegExp(keyword)
    let re = new RegExp(`${fixed}`, "i");
    let result = strReq.search(re)
    if (result != -1) {
      {
        addToEvidenceList(permissionEnum.personalData, rootUrl, strReq, reqUrl, type, [result, result + keyword.length])
      }
    }
}

export { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch }
