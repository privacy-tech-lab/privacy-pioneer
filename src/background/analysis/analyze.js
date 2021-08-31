/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

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
import { MAX_BYTE_LEN } from "./constants.js";
import { getAllEvidenceForCookies } from "./requestAnalysis/scanCookies.js";

// Temporary container to hold network requests while properties are being added from listener callbacks
const buffer = {}

// Used to decode HTTP responses
const decoder = new TextDecoder("utf-8")


/**
 * OnBeforeRequest callback
 * 
 * Mozilla docs outlines several ways to parse incoming chunks of data; Feel free to experiment with others
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
 * 
 * Defined in analyze.js
 * 
 * Used in background.js
 * 
 * @param {Object} details Individual request
 * @param {Array} data Data from importData function [locCoords, networkKeywords, services]
 * @returns {Void} Calls resolveBuffer (in analyze.js)
 */
const onBeforeRequest = (details, data) => {
  
  let request

  if (details.requestId in buffer) {
    // if the requestID has already been added, update details, request body as needed
    request = buffer[details.requestId]
    request.rootUrl = details.originUrl !== undefined ? details.originUrl : null
    request.reqUrl = details.url !== undefined ? details.url : null
    request.requestBody = details.requestBody !== undefined ? details.requestBody : null
    request.type = details.type !== undefined ? details.type : null
    request.urlClassification = details.urlClassification !== undefined ? details.urlClassification : []
  } else {
    // requestID not seen, create new request, add details and request body as needed
    request = new Request({
      id: details.requestId,
      rootUrl: details.originUrl !== undefined ? details.originUrl : null,
      reqUrl: details.url !== undefined ? details.url : null,
      requestBody: details.requestBody !== undefined ? details.requestBody : null,
      type: details.type !== undefined ? details.type : null,
      urlClassification: details.urlClassification !== undefined ? details.urlClassification : [],
    })
    buffer[details.requestId] = request
  }

  // filter = you can now monitor a response before the request is sent
  const filter = browser.webRequest.filterResponseData(details.requestId)

  var responseByteLength = 0,
   abort = false,
   httpResponseStrArr = []

  filter.ondata = (event) => {
    if (!abort) {
      filter.write(event.data)
      responseByteLength += event.data.byteLength
      if ( responseByteLength > MAX_BYTE_LEN ) {
        filter.disconnect()
        abort = true
      }
      else {
        const str = decoder.decode(event.data, { stream: true })
        httpResponseStrArr.push(str)
      }
    }
  }

  filter.onerror = (event) => (request.error = filter.error)

  // when the filter stops, close filter, add data from httpResponseStrArr to
  // our Request created earlier. Sends to resolveBuffer (below)
  filter.onstop = async (event) => {
    if (!abort) {
      filter.close()
      request.responseData = httpResponseStrArr.toString()
      resolveBuffer(request.id, data)
      }
  }
}

/**
 * Verifies if we have all the data for a request to be analyzed
 * 
 * Defined, used in analyze.js
 * 
 * @param {int} id id of the request
 * @param {Array} data Data from importData function [locCoords, networkKeywords, services]
 * @returns {void} calls analyze function, below
 */
function resolveBuffer(id, data) {
  if (id in buffer) {
    const request = buffer[id]
    if (
      request.reqUrl !== undefined &&
      request.responseData !== undefined &&
      request.type !== undefined &&
      request.requestBody !== undefined
    ) {

    // if our request is completely valid and we have everything we need to analyze
    // the request, continue. No else statement
    // delete the request from our buffer (we have it stored for this function as request)
    delete buffer[id]

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
 * Defined, used in analyze.js
 * 
 * @param {Request} request HTTP request.
 * @param {Array} userData data from the watchlist to be searched for.
 * @returns {void} calls a number of functions
 */
async function analyze(request, userData) {

  const allEvidence = getAllEvidenceForRequest(request, userData);

  if (await browser.cookies.getAll({url: request.reqUrl}).length != 0){
    const allCookieEvidence = getAllEvidenceForCookies(await browser.cookies.getAll({url: request.reqUrl}), request.rootUrl, request.reqUrl, userData)
    if (allCookieEvidence.length != 0) {
      allCookieEvidence.forEach(cookieEv => {
        allEvidence.push(cookieEv)
      })
    }
  }
  
  // if we found evidence for the request
  if (allEvidence.length != 0) {
    const rootUrl = request.rootUrl
    const reqUrl = request.reqUrl
    // tag the parent and the store
    const partyBool = await tagParty(rootUrl)
    const parent = tagParent(reqUrl)

    const saveFullSnippet = userData[3]

    // push the job to the Queue (will add the evidence for one HTTP request at a time)
    evidenceQ.push(function(cb) { cb(null, addToEvidenceStore(allEvidence, partyBool, parent, rootUrl, reqUrl, saveFullSnippet))});
  }
}

export { onBeforeRequest }
