/*
analyze.js
================================================================================
- analyze.js analyzes network requests
*/

import { Request } from "./classModels.js";
import { evidenceQ } from "../background.js";
import { tagParty, tagParent } from "./requestAnalysis/tagRequests.js";
import { addToEvidenceStore } from "./interactDB/addEvidence.js";
import { getAllEvidenceForRequest } from "./requestAnalysis/scanHTTP.js";

// Temporary container to hold network requests while properties are being added from listener callbacks
const buffer = {}

// OnBeforeRequest callback
// Mozilla docs outlines several ways to parse incoming chunks of data; Feel free to experiment with others
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
const onBeforeRequest = (details, data) => {
  // filter = you can now monitor a response before the request is sent
  const filter = browser.webRequest.filterResponseData(details.requestId),
    decoder = new TextDecoder("utf-8"),
    d = []
  let request

  if (details.requestId in buffer) {
    // if the requestID has already been added, update details, request body as needed
    request = buffer[details.requestId]
    request.details = details !== undefined ? details : null
    request.requestBody = details.requestBody !== undefined ? details.requestBody : null
    request.type = details.type !== undefined ? details.type : null
  } else {
    // requestID not seen, create new request, add details and request body as needed
    request = new Request({
      id: details.requestId,
      details: details !== undefined ? details : null,
      requestBody: details.requestBody !== undefined ? details.requestBody : null,
      type: details.type !== undefined ? details.type : null,
    })
    buffer[details.requestId] = request
  }

  filter.onstart = (event) => {}

  // on data received, add it to list d. This is analyzed for our keywords, etc later
  filter.ondata = (event) => {
    const str = decoder.decode(event.data, { stream: true })
    d.push(str)
    filter.write(event.data)
  }

  filter.onerror = (event) => (request.error = filter.error)

  // when the filter stops, close filter, add data from d (as connected string) to
  // our Request created earlier. Sends to resolveBuffer (below)
  filter.onstop = async (event) => {
    filter.close()
    request.responseData = d.toString()
    resolveBuffer(request.id, data)
  }
}

// OnBeforeSendHeaders callback
const onBeforeSendHeaders = (details, data) => {

  let request

  if (details.requestId in buffer) {
    // if the requestID has already been added, update request headers as needed
    request = buffer[details.requestId]
    request.requestHeaders = details.requestHeaders !== undefined ? details.requestHeaders : null
  } else {
    // requestID not seen, create new request, add request headers as needed
    request = new Request({
      id: details.requestId,
      requestHeaders: details.requestHeaders !== undefined ? details.requestHeaders : null,
    })
    buffer[details.requestId] = request
  }

  // below
  resolveBuffer(request.id, data)
}

// OnHeadersReceived callback
const onHeadersReceived = (details, data) => {
  let request

  if (details.requestId in buffer) {
    // if the requestID has already been added, update request headers as needed
    request = buffer[details.requestId]
    request.responseHeaders = details.responseHeaders !== undefined ? details.responseHeaders : null
    request.urlClassification = details.urlClassification
  } else {
    // requestID not seen, create new request, add response headers as needed
    request = new Request({
      id: details.requestId,
      responseHeaders: details.responseHeaders !== undefined ? details.responseHeaders : null,
      urlClassification: details.urlClassification,
    })
    buffer[details.requestId] = request
  }

  // below
  resolveBuffer(request.id, data)
}

// Verifies if we have all the data for a request to be analyzed
function resolveBuffer(id, data) {
  if (id in buffer) {
    const request = buffer[id]
    if (
      request.requestHeaders !== undefined &&
      request.responseHeaders !== undefined &&
      request.details !== undefined &&
      request.responseData !== undefined &&
      request.type !== undefined
    ) {
    // if our request is completely valid and we have everything we need to analyze
    // the request, continue. No else statement
    // delete the request from our buffer (we have it stored for this function as request)
    delete buffer[id]

    // run analysis
    analyze(request, data)

    }
  } 
  
  else {
    // I don't think this will ever happen, but just in case, maybe a redirect?
    console.log(`ERROR: REQUEST WITH ID: ${id} NOT IN BUFFER`)
  }
}

/**
 * Calls the analysis functions from searchFunctions.js on the appropriate data that we have
 * 
 * @param {Request} request HTTP request.
 * @param {Array} userData data from the watchlist to be searched for.
 * @returns {void} calls a number of functions
 */
async function analyze(request, userData) {

  const allEvidence = getAllEvidenceForRequest(request, userData);
  
  // if we found evidence for the request
  if (allEvidence.length != 0) {
    const rootUrl = request.details["originUrl"]
    const reqUrl = request.details["url"]
    // tag the parent and the store
    const partyBool = await tagParty(rootUrl)
    const parent = tagParent(reqUrl)
    
    // push the job to the Queue (will add the evidence for one HTTP request at a time)
    evidenceQ.push(function(cb) { cb(null, addToEvidenceStore(allEvidence, partyBool, parent, rootUrl))});
  }
}

export { onBeforeRequest, onHeadersReceived, onBeforeSendHeaders }
