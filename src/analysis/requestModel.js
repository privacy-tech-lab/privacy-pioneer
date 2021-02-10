/* 
requestModel.js
================================================================================
- requestModel.js defines a structure of a network request
*/

export class Request {
  constructor({id, details, requestHeaders, responseHeaders, requestBody, responseData, error}) {
    this.id = id // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData#parameters
    this.requestHeaders = requestHeaders // https://developer.mozilla.org/en-US/docs/Glossary/Request_header
    this.responseHeaders = responseHeaders // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/HttpHeaders
    this.responseData = responseData // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter
    this.requestBody = requestBody // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#details
    this.details = details // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#details
    this.error = error // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/onerror
  }
}
