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
    encoder = new TextEncoder(),
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

  filter.ondata = (event) => data.push(event.data)

  filter.onerror = (event) => (request.error = filter.error)

  filter.onstop = async (event) => {
    const blob = new Blob(data, { type: "text/javascript" }),
      str = await blob.text()

    request.responseData = str
    filter.write(encoder.encode(str))
    filter.close()

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

// Verfies if we have all the data for a request to be analyzed
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
  // Request ready to be analyzed
  var strReq = JSON.stringify(request);
  var splitReq = strReq.split(" ");

  for (var i = 0; i < splitReq.length; i++) {
    currWord = splitReq[i]
    // iterate through keywords json
  }
}

export { onBeforeRequest, onHeadersReceived, onBeforeSendHeaders }
