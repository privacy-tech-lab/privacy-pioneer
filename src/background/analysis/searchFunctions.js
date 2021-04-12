/*
searchFunctions.js
================================================================================
- searchFunctions.js contains all functions used to search through network
requests
*/
import { Request, Evidence } from "./classModels.js"
import { openDB } from 'idb';
import { evidence } from "../background.js"
import { idbKeyval } from "./openDB.js"

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

// takes in full url and extracts just the domain host
const getHostname = (url) => {
  // use URL constructor and return hostname
  try {
    return new URL(url).hostname;
  }
  catch(err) {
    console.log(err)
    return url
  }
}

// given the permission category, the url of the request, and the snippet
// from the request, get the current time in ms and add to our evidence list
function addToEvidenceList(perm, rootU, snip, requestU, t) {
  var ts = Date.now()
  if (rootU == undefined) {
    rootU = requestU
  }
  var rootUrl = getHostname(rootU)
  const e = new Evidence( {
    timestamp: ts,
    permission: perm,
    rootUrl: rootUrl,
    snippet: snip,
    requestUrl: requestU,
    typ: t
  })

  // we're missing getting the stored evidence values for persistence. so this
  // is where we will make a call to the indexedDB to set evidence as whatever
  // is stored there for the rootURL

  var evidenceDict = {}
  var typeHashed = hashTypeAndPermission(perm.concat(t));
  evidenceDict[typeHashed] = e
  var permDict = {}
  permDict[perm] = evidenceDict

    // if there already exists this specific type and permission we don't want to add it
  if (rootUrl in evidence) {
    var rootDict = evidence[rootUrl]
    if (perm in evidence[rootUrl]) {
      var permDictNew = evidence[rootUrl][perm]
      if (typeHashed in evidence[rootUrl][perm]) {
        // do nothing because this type of category is already there
      }
        // if it doesn't exist let's add it
      else {
        permDictNew[typeHashed] = e
        evidence[rootUrl] = permDictNew
      }
    }
      // if it doesn't exist let's add it
    else {
      rootDict[perm] = evidenceDict
      evidence[rootUrl] = rootDict
    }
  }
  // if it doesn't exist let's add it
  else {
    evidence[rootUrl] = permDict
  }

  idbKeyval.set("evidence", evidence)
}

// Look in request for keywords from list of keywords built from user's
// location and the Google Maps geocoding API
function locationKeywordSearch(strReq, networkKeywords, rootUrl, reqUrl) {
  var locElems = networkKeywords["location"]
  for (var j = 0; j < locElems.length; j++) {
    if (strReq.includes(locElems[j])) {
      // console.log(locElems[j] + " detected for snippet " + strReq)
      addToEvidenceList("Location", rootUrl, strReq, reqUrl, locElems[j])
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
              addToEvidenceList(cat, request.details["originUrl"], "null", request.details["url"], cat)
            }
          }
        }
        // else we go here
        else {
          if (url.includes(urlLst)) {
            // console.log(cat + " URL detected for " + urlLst)
            addToEvidenceList(cat, request.details["originUrl"], "null", request.details["url"], cat)
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
            // console.log(`Lazy match for (${lat}, ${lng}) with ${potentialMatch}`);
            addToEvidenceList("Location", rootUrl, strReq, reqUrl, "coordinatesLazy")
          }
          if (deltaLat < .1 && deltaLng < .1) {
            // conosole.log(`Tight match (within 7 miles) for (${lat}, ${lng}) with ${potentialMatch}`);
            addToEvidenceList("Location", rootUrl, strReq, reqUrl, "coordinatesTight")
        }
      }
    }
  }
 })
}

// should be passed request as a string and keywords as an array
function regexSearch(strReq, keywords, rootUrl, reqUrl) {
  keywords.forEach(keyword => {
    let fixed = escapeRegExp(keyword)
    let re = new RegExp(`${fixed}`, "i");
    let result = strReq.search(re)
    if (result != -1) {
      // 15 characters left and right of the found keyword
      if (result - 15 > 0 && result + keyword.length + 15 < strReq.length) {
        // console.log(strReq.slice(result - 15, result + keyword.length + 15))
        addToEvidenceList("Phone", rootUrl, strReq, reqUrl, "phoneNumber")
      }
    }
  })
}

export { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch }
