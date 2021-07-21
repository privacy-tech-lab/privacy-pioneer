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
 * @property {string} type We set up a filter for types in background.js. We look at types enumerated in resourceTypeEnum
 * @property {Object} urlClassification The urlClassification flags given by firefox in the onHeadersReceived callback. These come from the disconnect.me list. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onHeadersReceived
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
    urlClassification,
  }) {
    this.id = id;
    this.requestHeaders = requestHeaders;
    this.responseHeaders = responseHeaders;
    this.responseData = responseData;
    this.requestBody = requestBody;
    this.details = details;
    this.error = error;
    this.type = type;
    this.urlClassification = urlClassification;
  }
}


/**
 * @enum {string} Enum used to reference the types of HTTP requests. This filter is set up in background.js.
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
 */
export const resourceTypeEnum = Object.freeze( {
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
 * @property {string|undefined} extraDetail Extra details as needed. Currently only used for encoded email's original email
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
    extraDetail,
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
    this.extraDetail = extraDetail;
  }
}

/**
 * @enum {string} Enum used to reference which evidenceKeyval object store you want
 */
export const storeEnum = Object.freeze({
  firstParty: 'firstPartyEvidence',
  thirdParty: 'thirdPartyEvidence'
})

/**
 * @enum {string} Enum used to reference file formats that are available for export
 */
export const exportTypeEnum = Object.freeze({
  JSON: 'JSON',
  TSV: 'tsv',
});

/**
 * permissions are the broader category that types belong to (see typeEnum)
 * @enum {string} Enum used to reference permissions. Type: String
 */
export const permissionEnum = Object.freeze({
  monetization: "monetization",
  location: "location",
  watchlist: "watchlist",
  tracking: "tracking",
});

/**
 * All types fall under a permission (see permissionEnum)
 * @enum {string} Enum used to reference types. Type: String
 */
export const typeEnum = Object.freeze({

  // monetization types
  advertising: "advertising",
  analytics: "analytics",
  social: "social",

  // location types
  coarseLocation: "coarseLocation",
  tightLocation: "tightLocation",
  zipCode: "zipCode",
  streetAddress: "streetAddress",
  city: "city",
  state: "state",

  // watchlist types
  phoneNumber: "phoneNumber",
  emailAddress: "emailAddress",
  encodedEmail: "encodedEmail",
  userKeyword: "userKeyword",

  // tracking types
  trackingPixel: "trackingPixel",
  possiblePixel: "possiblePixel",
  ipAddress: "ipAddress",
  fingerprinting: "fingerprinting",
});

/**
 * An object containing the keyword types for the watchlist and information to populate defaults.
 * @typedef keywordTypes
 * @type {object}
 *
 */
export const keywordTypes = Object.freeze({
  userKeyword: {
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
 * An object used by the front end to create labels. Before displaying evidence pulled from the DB, the front-end checks that the 
 * permission and type exist in this object. The permissions and types should be exactly the same as the enums.
 * 
 * @type {object}
 */
export const privacyLabels = Object.freeze({
  monetization: {
    displayName: "Monetization",
    description: "Practices used to monetize web traffic.",
    types: {
      advertising: {
        displayName: "Advertising",
        description: "An Advertising company sent or received your data.",
      },
      analytics: {
        displayName: "Analytics",
        description: "An Analytics company sent or received your data.",
      },
      social: {
        displayName: "Social",
        description: "A Social media company sent or received your data.",
      }
    },
  },
  location: {
    displayName: "Location",
    description: "An element of your location was found in your web traffic.",
    types: {
      coarseLocation: {
        displayName: "Coarse Location",
        description: "",
      },
      tightLocation: {
        displayName: "Tight Location",
        description: "Your Tight Location (lattitude and longitude coordinates) were found in a request.",
      },
      zipCode: {
        displayName: "Zip Code",
        description: "Your Zip Code was found in a request.",
      },
      streetAddress: {
        displayName: "Street Address",
        description: "Your Street Address was found in a request.",
      },
      city: {
        displayName: "City",
        description: "Your City was found in a request.",
      },
      state: {
        displayName: "State",
        description: "Your State was found in a request.",
      },
    },
  },
  watchlist: {
    displayName: "Watchlist",
    description: "Evidence generated from your custom watchlist inputs.",
    types: {
      phoneNumber: {
        displayName: "Phone Number",
        description: "A Phone Number from your watchlist was found in a request.",
      },
      emailAddress: {
        displayName: "Email Address",
        description: "An Email Address from your watchlist was found in a request.",
      },
      encodedEmail: {
        displayName: "Encoded Email",
        description: "An Email Address from your watchlist was found in an alternate representation (The Trade Desk's UID)" // this should be updated with a link or different wording
      },
      userKeyword: {
        displayName: "Keyword",
        description: "A Keyword from your watchlist was found in a request.",
      },
    },
  },
  tracking: {
    displayName: "Tracking",
    description: "A tracking practice was flagged in your web traffic.",
    types: {
      trackingPixel: {
        displayName: "Tracking Pixel",
        description: "A Tracking Pixel is code that silently pings a third-party to track your internet activity.",
      },
      possiblePixel: {
        displayName: "Possible Pixel",
        description: "A Tracking Pixel is code that silently pings a third-party to track your internet activity."
      },
      ipAddress: {
        displayName: "IP Address",
        description: "Your IP Address identifies your device and can be used to fetch your location.",
      },
      fingerprinting: {
        displayName: "Browser Fingerprinting",
        description: "Browser Fingerprinting are practices that uniquely identify your browser to track activity across sessions.",
      },
    },
  },
});
