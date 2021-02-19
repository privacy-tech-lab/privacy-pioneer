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
      analyze(request)
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


export { onBeforeRequest, onHeadersReceived, onBeforeSendHeaders }
