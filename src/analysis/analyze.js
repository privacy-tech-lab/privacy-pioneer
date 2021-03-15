/*
analyze.js
================================================================================
- analyze.js analyzes network requests
*/

import { Request } from "./requestModel.js"
import { keywords } from "./importJson.js"
import { services } from "./importJson.js"

// Temporary container to hold network requests while properties are being added from listener callbacks
const buffer = {}

// OnBeforeRequest callback
// Mozilla docs outlines several ways to parse incoming chunks of data; Feel free to experiment with others
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
const onBeforeRequest = (details, locData) => {
  const filter = browser.webRequest.filterResponseData(details.requestId),
    decoder = new TextDecoder("utf-8"),
    data = []
  let request

  if (details.requestId in buffer) {
    request = buffer[details.requestId]
    request.details = details !== undefined ? details : null
    request.requestBody = details.requestBody !== undefined ? details.requestBody : null
  } else {
    request = new Request({
      id: details.requestId,
      details: details !== undefined ? details : null,
      requestBody: details.requestBody !== undefined ? details.requestBody : null,
    })
    buffer[details.requestId] = request
  }

  filter.onstart = (event) => {}

  filter.ondata = (event) => {
    const str = decoder.decode(event.data, { stream: true })
    data.push(str)
    filter.write(event.data)
  }

  filter.onerror = (event) => (request.error = filter.error)

  filter.onstop = async (event) => {
    filter.close()
    request.responseData = data.toString()
    resolveBuffer(request.id, locData)
  }
}

// OnBeforeSendHeaders callback
const onBeforeSendHeaders = (details, locData) => {
  let request

  if (details.requestId in buffer) {
    request = buffer[details.requestId]
    request.requestHeaders = details.requestHeaders !== undefined ? details.requestHeaders : null
  } else {
    request = new Request({
      id: details.requestId,
      requestHeaders: details.requestHeaders !== undefined ? details.requestHeaders : null,
    })
    buffer[details.requestId] = request
  }

  resolveBuffer(request.id, locData)
}

// OnHeadersReceived callback
const onHeadersReceived = (details, locData) => {
  let request

  if (details.requestId in buffer) {
    request = buffer[details.requestId]
    request.responseHeaders = details.responeHeaders !== undefined ? details.responseHeaders : null
  } else {
    request = new Request({
      id: details.requestId,
      responseHeaders: details.responeHeaders !== undefined ? details.responseHeaders : null,
    })
    buffer[details.requestId] = request
  }

  resolveBuffer(request.id, locData)
}

// Verifies if we have all the data for a request to be analyzed
function resolveBuffer(id, locData) {
  if (id in buffer) {
    const request = buffer[id]
    if (
      request.requestHeaders !== undefined &&
      request.responseHeaders !== undefined &&
      request.details !== undefined &&
      request.responseData !== undefined
    ) {
      delete buffer[id]
      // analyze(request)
      // if this value is 0 the client likely denied location permission
      // or they could be on Null Island in the middle of the Gulf of Guinea
      if (locData[0] != 0 && locData[1] != 0) {
        coordinateSearch(request, locData);
        //otherLocDataSearch(request, locData);
        userMatch(request);
      }
    }
  } else {
    // I don't think this will ever happen, but just in case, maybe a redirect?
    console.log(`ERROR: REQUEST WITH ID: ${id} NOT IN BUFFER`)
  }
}

// Analyzes request
function analyze(request) {
  // First we can iterate through URLs
  var keys = Object.keys(services["categories"]);
  for (var i = 0; i < keys.length; i++) {
    var cat = keys[i]
    var indivCats = services["categories"][cat]
    for (var j = 0; j < indivCats.length; j++) {
      var obj = services["categories"][cat][j]
      var indivKey = Object.keys(obj)
      var nextKey = Object.keys(services["categories"][cat][j][indivKey])
      for (var k = 0; k < nextKey.length; k++) {
        var urlLst = services["categories"][cat][j][indivKey][nextKey[k]]
        var url = request.details["url"]
        if (typeof urlLst === 'object') {
          for (var u = 0; u < urlLst.length; u++) {
            if (url.includes(urlLst[u])) {
              console.log(cat + " URL detected for " + urlLst[u])
            }
          }
        }
        else {
          if (url.includes(urlLst)) {
            console.log(cat + " URL detected for " + urlLst)
          }
        }
      }
    }
  }
}

// from the location data json, finds all the address components to then use
// in the text search
function otherLocDataSearch(request, locData) {
  // list of state abbreviations we want to exclude as they are too small
  // and will show up when they don't actually mean location
  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]

  const data = locData[2]
  const lst = data["results"][0]["address_components"]
  var locElems = []
  // adds all the different components of the location address to list
  for (var i = 0; i < lst.length; i++) {
    const obj = lst[i]

    if (locElems.indexOf(obj["long_name"]) === -1) {
      // if the element is just an int we don't want it
      if (!(/^\d+$/.test(obj["long_name"]))) {
        // we don't want country or state codes either
        if (!(obj["long_name"] == "US" || states.includes(obj["long_name"]))) {
          locElems.push(obj["long_name"]);
        }
      }
    }
    
    if (locElems.indexOf(obj["short_name"]) === -1) {
      // if the element is just an int we don't want it
      if (!(/^\d+$/.test(obj["short_name"]))) {
        // we don't want country or state codes either
        if (!(obj["short_name"] == "US" || states.includes(obj["short_name"]))) {
          locElems.push(obj["short_name"]);
        }
      }
    }
  }

  // Now we can iterate through keywords
  var strReq = JSON.stringify(request);
  for (var j = 0; j < locElems.length; j++) {
    if (strReq.includes(locElems[j])) {
      console.log(locElems[j] + " detected for snippet " + strReq)
    }
  }
}

// try to build floats out of HTTP request strings to find users location
function coordinateSearch(request, locData) {
  var lat = locData[0]
  var lng = locData[1]
  var absLat = Math.abs(lat)
  var absLng = Math.abs(lng)

  //take request => JSON and build list of decimals
  var strReq = JSON.stringify(request);
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

      //don't run routine when we have spaces on either side of the decimal
      if ( oneLeft != ' ' || oneRight != ' ') {
        
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
            console.log(`Lazy match for (${lat}, ${lng}) with ${potentialMatch}`);
          }
          if (deltaLat < .1 && deltaLng < .1) {
            conosole.log(`Tight match (within 7 miles) for (${lat}, ${lng}) with ${potentialMatch}`);
          }
          
        }
       }
      }
     })
   }

  async function userMatch(request) {
    let currKeywordsObject = await browser.storage.local.get("userKeywords");
    var currKeywords = (Object.values(currKeywordsObject)[0]);
    let requestStr = new String(request);

    currKeywords.forEach(keyword => {
      let re = new RegExp(`${keyword}`, "i");
      if (requestStr.search(re) > 0) {
        console.log(keyword);
        console.log(requestStr.match(re));
      }

    })
  }


export { onBeforeRequest, onHeadersReceived, onBeforeSendHeaders }
