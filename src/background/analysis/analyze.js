/*
analyze.js
================================================================================
- analyze.js analyzes network requests
*/

import { Request, Evidence, typeEnum, permissionEnum, resourceTypeEnum, optOutEnum } from "./classModels.js"
import { openDB } from 'idb';
import { evidence } from "../background.js"
import { evidenceKeyval } from "./openDB.js"

import { RegexSpecialChar, escapeRegExp } from "./regexFunctions.js"
import { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch, fingerprintSearch, ipSearch, pixelSearch } from "./searchFunctions.js"
import { getHostname } from "./util.js";
import { tagOptOuts } from "./optOutSignalCheck.js";

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
  } else {
    // requestID not seen, create new request, add response headers as needed
    request = new Request({
      id: details.requestId,
      responseHeaders: details.responseHeaders !== undefined ? details.responseHeaders : null,
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

    // this should be done only once. it's result can be passed throughout the extension.
    const strRequest = JSON.stringify(request);

    //tag the request's optOuts
    const optOuts = tagOptOuts(request, strRequest);

    // run analysis
    analyze(request, data, optOuts, strRequest);

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
 * @param {Dict} optOuts a dictionary mapping privacy schemes to our opt-our finding for that scheme
 * @returns {void} calls a number of functions
 */
function analyze(request, userData, optOuts, strRequest) {

  
  

  // this 0, 1, 2 comes from the structure of the importData function
  // location we obtained from google maps API
  var loc = userData[0]
  // {phone #s, emails, location elements entered by the user, fingerprinting keywords}
  var networkKeywords = userData[1]
  // websites that have identification objectives
  var urls = userData[2]
  const rootUrl = request.details["originUrl"]
  const reqUrl = request.details["url"]

  // if this value is 0 the client likely denied location permission
  // or they could be on Null Island in the middle of the Gulf of Guinea
  if (loc[0] != 0 && loc[1] != 0) {
    coordinateSearch(strRequest, loc, rootUrl, reqUrl, optOuts);
  }
  // search for location data if we have it
  if ( permissionEnum.location in networkKeywords) {
    locationKeywordSearch(strRequest, networkKeywords[permissionEnum.location], rootUrl, reqUrl, optOuts)
  }
  // search for personal data from user's watchlist
  if ( permissionEnum.watchlist in networkKeywords) {
    if ( typeEnum.Phone in networkKeywords[permissionEnum.watchlist] ) {
      networkKeywords[permissionEnum.watchlist][typeEnum.phone].forEach( number => {
        regexSearch(strRequest, number, rootUrl, reqUrl, typeEnum.phone, optOuts)
      })
    }
    if ( typeEnum.Email in networkKeywords[permissionEnum.watchlist] ) {
      networkKeywords[permissionEnum.watchlist][typeEnum.email].forEach( email => {
        regexSearch(strRequest, email, rootUrl, reqUrl, typeEnum.email, optOuts)
      })
    }

    if ( typeEnum.userKeyword in networkKeywords[permissionEnum.watchlist] ) {
      networkKeywords[permissionEnum.watchlist][typeEnum.userKeyword].forEach ( keyword => {
        regexSearch(strRequest, keyword, rootUrl, reqUrl, typeEnum.userKeyword, optOuts)
      })
    }

    if ( typeEnum.ipAddress in networkKeywords[permissionEnum.watchlist] ) {
      networkKeywords[permissionEnum.watchlist][typeEnum.ipAddress].forEach( ip => {
        ipSearch(strRequest, ip, rootUrl, reqUrl, optOuts)
      })
    }
  }

  // search to see if the url of the root or request comes up in our services list
  urlSearch(request, urls, optOuts)

  // search to see if any fingerprint data
  fingerprintSearch(strRequest, networkKeywords, rootUrl, reqUrl, optOuts)

  // if the request is an image or subFrame and is coming from a different url than the root, we look for our pixel URLs
  if ( (request.type == resourceTypeEnum.image || request.type == resourceTypeEnum.subFrame) && rootUrl != reqUrl ) {
    pixelSearch(strRequest, networkKeywords, rootUrl, reqUrl, optOuts)
  }
}

/**
 * Callback for when the tab is updated. Calls coordinate search
 * @callback tabUpdate
 * @function tabUpdate
 * @param {number} tabId id of the tab 
 * @param {object} changeInfo object containing information about the updated 
 * @param {object} tab The new state of the tab 
 * @param {Array} data The imported data from importData()
 */
const tabUpdate = (tabId, changeInfo, tab, data) => {

  if (changeInfo.url) {
    let loc = data[0]
    let root = getHostname(changeInfo.url)
    coordinateSearch(changeInfo.url, loc, root, root)
  }
}

export { onBeforeRequest, onHeadersReceived, onBeforeSendHeaders, tabUpdate }
