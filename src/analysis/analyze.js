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
const onBeforeRequest = (details) => {
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
    resolveBuffer(request.id)
  }
}

// OnBeforeSendHeaders callback
const onBeforeSendHeaders = (details) => {
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

  resolveBuffer(request.id)
}

// OnHeadersReceived callback
const onHeadersReceived = (details) => {
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

  resolveBuffer(request.id)
}

// Verifies if we have all the data for a request to be analyzed
function resolveBuffer(id) {
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
      locationSearch(request);
    }
  } else {
    // I don't think this will ever happen, but just in case, maybe a redirect?
    console.log(`ERROR: REQUEST WITH ID: ${id} NOT IN BUFFER`)
  }
}

var absLat = 0;
var absLng = 0;
var lat = 0;
var lng = 0;

function getLocation(request) {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        absLat = Math.abs(position.coords.latitude);
        absLng = Math.abs(position.coords.longitude);
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      }, function(error) {
          console.log("error")
      });
    } else {
      // Fallback for no geolocation
      console.log("location permission denied")
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



  // Now we can iterate through keywords
  var strReq = JSON.stringify(request);
  var splitReq = strReq.split(" ");
  var keys = Object.keys(keywords);
  for (var i = 0; i < splitReq.length; i++) {
    var currWord = splitReq[i]
    for (var j = 0; j < keys.length; j++) {
      var bodyKeysLst = keywords[keys[j]]["Bodies"]
      for (var k = 0; k < bodyKeysLst.length; k++) {
        if (currWord.includes(bodyKeysLst[k])) {
          console.log(keys[j] + " detected for snippet " + currWord)
        }
      }
    }
  }
}

// try to build floats out of HTTP request strings to find users location
function locationSearch(request) {

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

      if (oneLeft == ' ' || oneRight == ' ') {
        //don't run routine when we have spaces on either side of the decimal
      }
      else
      {
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
          if (absLat === 0 || absLng === 0){
            getLocation();
          }
          else
          {
            const asFloat = parseFloat(potentialMatch);
            // lazy bound of 1 for matches.
            if ( (Math.abs(asFloat - absLat) < 1) || (Math.abs(asFloat - absLng) < 1) )
            {
            console.log(`Your location is (${lat} , ${lng}): We found ${potentialMatch}`)
            }
          }         
        }
      }
    }
  })
}


export { onBeforeRequest, onHeadersReceived, onBeforeSendHeaders }
