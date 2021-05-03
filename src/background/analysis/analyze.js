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
import { regexSearch, coordinateSearch, urlSearch, locationKeywordSearch, fingerprintSearch } from "./searchFunctions"

// Temporary container to hold network requests while properties are being added from listener callbacks
const buffer = {}

// OnBeforeRequest callback
// Mozilla docs outlines several ways to parse incoming chunks of data; Feel free to experiment with others
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
const onBeforeRequest = (details, data) => {
  const filter = browser.webRequest.filterResponseData(details.requestId),
    decoder = new TextDecoder("utf-8"),
    d = []
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
    d.push(str)
    filter.write(event.data)
  }

  filter.onerror = (event) => (request.error = filter.error)

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
    request = buffer[details.requestId]
    request.requestHeaders = details.requestHeaders !== undefined ? details.requestHeaders : null
  } else {
    request = new Request({
      id: details.requestId,
      requestHeaders: details.requestHeaders !== undefined ? details.requestHeaders : null,
    })
    buffer[details.requestId] = request
  }

  resolveBuffer(request.id, data)
}

// OnHeadersReceived callback
const onHeadersReceived = (details, data) => {
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
      delete buffer[id]

      // this one two three comes from the structure of the importData function
      var loc = data[0]
      var networkKeywords = data[1]
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
      if (networkKeywords[permissionEnum.Location].length != 0) {
        locationKeywordSearch(strRequest, networkKeywords, rootUrl, reqUrl)
      }

      // search for personal data
      if ( permissionEnum.PersonalData in networkKeywords) {
        if ( typeEnum.Phone in networkKeywords[permissionEnum.PersonalData] ) {
          networkKeywords[permissionEnum.PersonalData][typeEnum.Phone].forEach( number => {
            regexSearch(strRequest, number, rootUrl, reqUrl, typeEnum.Phone)
          })
        }
        if ( typeEnum.Email in networkKeywords[permissionEnum.PersonalData] ) {
          networkKeywords[permissionEnum.PersonalData][typeEnum.Email].forEach( email => {
            regexSearch(strRequest, email, rootUrl, reqUrl, typeEnum.Email)
          })
        }
      }

      // search to see if the url comes up in our services list
      urlSearch(request, urls)

      // search to see if any fingerprint data
      fingerprintSearch(strRequest, networkKeywords, rootUrl, reqUrl)
    }
  } else {
    // I don't think this will ever happen, but just in case, maybe a redirect?
    console.log(`ERROR: REQUEST WITH ID: ${id} NOT IN BUFFER`)
  }
}

export { onBeforeRequest, onHeadersReceived, onBeforeSendHeaders }
