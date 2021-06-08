/*
analyze.js
================================================================================
- analyze.js analyzes network requests
*/

/*
For reference, here is a mockup of the Evidence type
const evidence = new Evidence({
  timestamp: "10/10/20",
  permission: "location",
  type: "zipcode",
  rooturl: "facebook.com",
  requesturl: "facebook.com/js"
  snippet: "blahblah"
  index: undefined #to mean we don't want to pass an index
})
*/
import { Request, Evidence, typeEnum, permissionEnum } from "./classModels.js"
import { openDB } from 'idb';
import { evidence } from "../background.js"
import { EvidenceKeyval } from "./openDB.js"

import { RegexSpecialChar, escapeRegExp } from "./regexFunctions.js"
import { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch, fingerprintSearch, extractHostname } from "./searchFunctions"

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
  } else {
    // requestID not seen, create new request, add details and request body as needed
    request = new Request({
      id: details.requestId,
      details: details !== undefined ? details : null,
      requestBody: details.requestBody !== undefined ? details.requestBody : null,
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
    const strRequest = JSON.stringify(request)
    if (
      request.requestHeaders !== undefined &&
      request.responseHeaders !== undefined &&
      request.details !== undefined &&
      request.responseData !== undefined
    ) {
      // if our request is completely valid and we have everything we need to analyze
      // the request, continue. No else statement

      // delete the request from our buffer (we have it stored for this function as request)
      delete buffer[id]

      // this 0, 1, 2 comes from the structure of the importData function
      // location we obtained from google maps API
      var loc = data[0]
      // {phone #s, emails, location elements entered by the user, fingerprinting keywords}
      var networkKeywords = data[1]
      // websites that have identification objectives
      var urls = data[2]
      const rootUrl = request.details["originUrl"]
      const reqUrl = request.details["url"]

      // if this value is 0 the client likely denied location permission
      // or they could be on Null Island in the middle of the Gulf of Guinea
      if (loc[0] != 0 && loc[1] != 0) {
        coordinateSearch(strRequest, loc, rootUrl, reqUrl);
      }
      // if this network keyword length is 0 then the geocoding failed
      // so no need to look through location keywords
      if (networkKeywords[permissionEnum.location].length != 0) {
        locationKeywordSearch(strRequest, networkKeywords, rootUrl, reqUrl)
      }

      // search for personal data from user's watchlist
      if ( permissionEnum.PersonalData in networkKeywords) {
        if ( typeEnum.Phone in networkKeywords[permissionEnum.personalData] ) {
          networkKeywords[permissionEnum.personalData][typeEnum.phone].forEach( number => {
            regexSearch(strRequest, number, rootUrl, reqUrl, typeEnum.phone)
          })
        }
        if ( typeEnum.Email in networkKeywords[permissionEnum.PersonalData] ) {
          networkKeywords[permissionEnum.personalData][typeEnum.email].forEach( email => {
            regexSearch(strRequest, email, rootUrl, reqUrl, typeEnum.email)
          })
        }
      }

      // search to see if the url of the root or request comes up in our services list
      urlSearch(request, urls)

      // search to see if any fingerprint data
      fingerprintSearch(strRequest, networkKeywords, rootUrl, reqUrl)
    }
  } else {
    // I don't think this will ever happen, but just in case, maybe a redirect?
    console.log(`ERROR: REQUEST WITH ID: ${id} NOT IN BUFFER`)
  }
}

// callback for tab update. Right now used to run analysis on the url
const tabUpdate = (tabId, changeInfo, tab, data) => {

  if (changeInfo.url) {
    let loc = data[0]
    let root = extractHostname(changeInfo.url)
    coordinateSearch(changeInfo.url, loc, root, root)
  }
}

export { onBeforeRequest, onHeadersReceived, onBeforeSendHeaders, tabUpdate }
