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

// class model for evidence type for when we find a keyword or URL
// we want index as an array [start, finish]
export class Evidence {
  constructor({timestamp, permission, rootUrl, snippet, requestUrl, typ, index}) {
    this.timestamp = timestamp;
    this.permission = permission;
    this.rootUrl = rootUrl;
    this.snippet = snippet;
    this.requestUrl = requestUrl;
    this.typ = typ;
    this.index = index === undefined ? -1 : index
  }
}



export const permissionEnum = Object.freeze( {
  Location: "Location",
  PersonalData: "PersonalData",
  Fingerprinting: "Fingerprinting",
  Advertising: "Advertising",
  Content: "Content",
} )


export const typeEnum = Object.freeze( { 
  CoarseLocation: "CoarseLocation",
  TightLocation: "TightLocation",
  City: "City",
  State: "State",
  StreetAddress: "StreetAddress",
  Social: "Social",
  IpAddress: "IpAddress",
  UserKeyword: "UserKeyword",
  Analytics: "Analytics",
  TrackingPixel: "TrackingPixel",
  CryptoMining: "CryptoMining",
  // for now we change convention to be consistent with the .json file 
  Phone: "phone_number",
  Email: "Email",
  Zipcode: "Zipcode",
} )
