/*
classModels.js
================================================================================
- classModels.js defines important classes, objects, and enums that we use throughout
the codebase.
*/

/**
 * Represents an HTTP request.
 * 
 * @class Request
 * @property {string} id The ID of the request to filter.
 * @property {object} details Contains details about the request https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#details 
 * @property {object} requestHeaders Contains the request headers of the request https://developer.mozilla.org/en-US/docs/Glossary/Request_header
 * @property {object} responseHeaders Contains the response headers of the request. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/HttpHeaders
 * @property {object} requestBody Contains the HTTP request body data.  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#details.
 * @property {object} responseData A StreamFilter object used to monitor the response. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter
 * @property {string} error After an error event is fired. This property will contain information about the error.  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/onerror
 * @property {string} type We set up a filter for types in background.js. We look at types enumerated in httpTypeEnum
 * @throws Error. Event that fires on error. Usually due to invalid ID to the webRequest.filterResponseData()
 */
export class Request {
  constructor({
    id,
    details,
    requestHeaders,
    responseHeaders,
    requestBody,
    responseData,
    error,
    type,
  }) {
    this.id = id;
    this.requestHeaders = requestHeaders;
    this.responseHeaders = responseHeaders;
    this.responseData = responseData;
    this.requestBody = requestBody;
    this.details = details;
    this.error = error;
    this.type = type;
  }
}


/**
 * @enum {string} Enum used to reference the types of HTTP requests. This filter is set up in background.js.
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
 */
export const httpTypeEnum = Object.freeze( {
  image: "image",
  script: "script",
  xml: "xmlhttprequest",
  subFrame: "sub_frame",
  WebSocket: "websocket", 
  mainFrame: "main_frame"
})

/**
 * An evidence object created from a request
 * @class Evidence
 * @property {date} timestamp The timestamp of the request
 * @property {enum} permission The permission of the evidence
 * @property {string} rootUrl The rootUrl of the request
 * @property {string} snippet JSON.stringify of the request (The request as a string)
 * @property {string} requestUrl The request Url as a string
 * @property {enum} typ The type of the evdience
 * @property {Array|undefined} index A length 2 array with the indexes of the evidence or undefined if not applicable
 * @property {boolean} firstPartyRoot A boolean indicating if the evidence was generated with a first party root (the rootUrl of the request is the same as the website that generated the request)
 * @property {string|null} parentCompany If we have identified a parent company for this url, we store it here for the frontend. Else, null.
 */
export class Evidence {
  constructor({
    timestamp,
    permission,
    rootUrl,
    snippet,
    requestUrl,
    typ,
    index,
    firstPartyRoot,
    parentCompany,
  }) {
    this.timestamp = timestamp;
    this.permission = permission;
    this.rootUrl = rootUrl;
    this.snippet = snippet;
    this.requestUrl = requestUrl;
    this.typ = typ;
    this.index = index === undefined ? -1 : index;
    this.firstPartyRoot = firstPartyRoot;
    this.parentCompany = parentCompany;
  }
}

/**
 * @enum {string} Enum used to reference permissions. Type: String
 */
export const permissionEnum = Object.freeze({
  location: "location",
  personalData: "personalData",
  fingerprinting: "fingerprinting",
  advertising: "advertising",
  tracking: "tracking",
});

/**
 * @enum {string} Enum used to reference types. Type: String
 */
export const typeEnum = Object.freeze({
  coarseLocation: "coarseLocation",
  tightLocation: "tightLocation",
  city: "city",
  state: "state",
  address: "address",
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
});

/**
 * An object containing the keyword types for the watchlist and information to populate defaults.
 * @typedef keywordTypes
 * @type {object}
 *
 */
export const keywordTypes = Object.freeze({
  general: {
    displayName: "General",
    placeholder: "Keyword",
  },
  location: {
    displayName: "Street Address",
    placeholder: {
      address: "45 Wyllys Ave",
      city: "Middletown",
      state: "CT",
      zipCode: "06459",
    },
  },
  phoneNumber: {
    displayName: "Phone Number",
    placeholder: "+1 (860) 685-2000",
  },
  emailAddress: {
    displayName: "Email Address",
    placeholder: "jdoe@wesleyan.edu",
  },
  ipAddress: {
    displayName: "IP Address",
    placeholder: "999.99.999.999",
    toolTip: "Google: What\'s my IP?. We will only flag instances where your IP is shared with a 3rd party. All websites you connect to have access to your IP address."
  },
});

/**
 * An object used by the front end to create labels. The permissions and types should be exactly the same as the enums.
 * @typedef privacyLabels
 * @type {object}
 */
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
      ipAddress: {
        displayName: "IP Address",
        description: "",
      },
    },
  },
  advertising: {
    displayName: "Advertising",
    description: "",
    types: {
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
      fpLibraryList: {
        displayName: "fpLibraryList",
        description: "",
      },
      fpJSONList: {
        displayName: "fpJSONList",
        description: "",
      },
    },
  },
  tracking: {
    displayName: "Tracking",
    description: "",
    types: {
      trackingPixel: {
        displayName: "Tracking Pixel",
        description: "",
      },
    },
  },
});
