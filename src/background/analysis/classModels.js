/*
classModels.js
================================================================================
- classModels.js defines important classes and objects that we use throughout
the project
*/

export class Request {
  constructor({ id, details, requestHeaders, responseHeaders, requestBody, responseData, error }) {
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
// permission = permission we associated the evidence to (from permissionEnum below)
// snippet = identified snippet of code we identified as containing the user's data
// typ = type (from typeEnum below)
// index = array like [start, finish] (for snippet)
export class Evidence {
  constructor({ timestamp, permission, rootUrl, snippet, requestUrl, typ, index }) {
    this.timestamp = timestamp
    this.permission = permission
    this.rootUrl = rootUrl
    this.snippet = snippet
    this.requestUrl = requestUrl
    this.typ = typ
    this.index = index === undefined ? -1 : index
  }
}

// should line up exactly with categories in privacy labels
export const permissionEnum = Object.freeze({
  location: "location",
  personalData: "personalData",
  fingerprinting: "fingerprinting",
  advertising: "advertising",
  content: "content",
})

// should line up exactly with types in privacy Labels
export const typeEnum = Object.freeze({
  coarseLocation: "coarseLocation",
  tightLocation: "tightLocation",
  city: "city",
  state: "state",
  streetAddress: "streetAddress",
  social: "social",
  ipAddress: "ipAddress",
  userKeyword: "userKeyword",
  general: "general",
  analytics: "analytics",
  trackingPixel: "trackingPixel",
  cryptoMining: "cryptoMining",
  phone: "phoneNumber",
  email: "emailAddress",
  zipCode: "zipCode",
  generalFingerprint: "generalFingerprint",
  invasiveFingerprint: "invasiveFingerprint",
  fingerprintLib: "fpLibraryList",
  fingerprintJSON: "fpJSONList",
})

// types for user input
export const keywordTypes = Object.freeze({
  general: {
    displayName: "General",
    placeholder: "Keyword",
  },
  streetAddress: {
    displayName: "Street Address",
    placeholder: "45 Wyllys Ave, Middletown CT, 06459",
  },
  phoneNumber: {
    displayName: "Phone Number",
    placeholder: "+1 (860) 685-2000",
  },
  emailAddress: {
    displayName: "Email Address",
    placeholder: "jdoe@wesleyan.edu",
  },
})

// source of truth for all naming conventions
export const privacyLabels = Object.freeze({
  location: {
    displayName: "Location",
    description: "",
    types: {
      coarseLocation: {
        displayName: "Coarse Location",
        description: "",
      },
      tightLocation: {
        displayName: "Tight Location",
        description: "",
      },
      zipCode: {
        displayName: "Zip Code",
        description: "",
      },
      ipAddress: {
        displayName: "Ip Address",
        description: "",
      },
      streetAddress: {
        displayName: "Street Address",
        description: "",
      },
      city: {
        displayName: "City",
        description: "",
      },
      state: {
        displayName: "State",
        description: "",
      },
    },
  },
  personalData: {
    displayName: "Personal Data",
    description: "",
    types: {
      phoneNumber: {
        displayName: "Phone Number",
        description: "",
      },
      emailAddress: {
        displayName: "Email Address",
        description: "",
      },
      social: {
        displayName: "Social",
        description: "",
      },
      userKeyword: {
        displayName: "Keyword",
        description: "",
      },
    },
  },
  advertising: {
    displayName: "Advertising",
    description: "",
    types: {
      trackingPixel: {
        displayName: "Tracking Pixel",
        description: "",
      },
      analytics: {
        displayName: "Analytics",
        description: "",
      },
    },
  },
  fingerprinting: {
    displayName: "Fingerprinting",
    description: "",
    types: {
      fingerprintingGeneral: {
        displayName: "General Fingerprinting",
        description: "",
      },
      fingerprintingInvasive: {
        displayName: "Invasive Fingerprinting",
        description:
          "Used an API to extract information about a particular user’s computing environment when the API was not designed to expose such information.",
      },
      fpLibararyList: {
        displayName: "fpLibraryList",
        description: "",
      }, 
      fpJSONList: {
        displayName: "fpJSONList",
        description: "",
    },
  },
  content: {
    displayName: "???",
    description: "",
    types: {},
  },
 }
})
