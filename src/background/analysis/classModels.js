/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

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
    rootUrl,
    reqUrl,
    requestBody,
    responseData,
    error,
    type,
    urlClassification,
  }) {
    this.id = id
    this.rootUrl = rootUrl
    this.reqUrl = reqUrl
    this.requestBody = requestBody
    this.responseData = responseData
    this.error = error
    this.type = type
    this.urlClassification = urlClassification
  }
}

/**
 * @enum {string} Enum used to reference the types of HTTP requests. This filter is set up in background.js.
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
 */
export const resourceTypeEnum = Object.freeze({
  image: "image",
  script: "script",
  xml: "xmlhttprequest",
  subFrame: "sub_frame",
  WebSocket: "websocket",
  mainFrame: "main_frame",
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
 * @property {string|null} parentCompany If we have identified a parent company for this url, we store it here for the frontend. Else, null.
 * @property {string|undefined} watchlistHash If the evidence is from our watchlist, this is the id of that item. Used for deletion of evidence on deletion of watchlist item
 * @property {string|undefined} extraDetail Extra details as needed. Currently only used for encoded email's original email
 * @property {boolean} cookie Whether or not the evidence was found in a cookie
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
    parentCompany,
    watchlistHash,
    extraDetail,
    cookie
  }) {
    this.timestamp = timestamp
    this.permission = permission
    this.rootUrl = rootUrl
    this.snippet = snippet
    this.requestUrl = requestUrl
    this.typ = typ
    this.index = index === undefined ? -1 : index
    this.parentCompany = parentCompany
    this.watchlistHash = watchlistHash
    this.extraDetail = extraDetail
    this.cookie = cookie
  }
}


/**
 * Used for the TSV export to describe evidence object
 * Should mirror the constructor of the above Evidence class exactly
 */
export const evidenceDescription = Object.freeze({
  timestamp: {
    title: "Timestamp"
  },
  permission: {
    title: "Permission"
  },
  rootUrl: {
    title: "Root URL"
  },
  snippet: {
    title: "HTTP Snippet"
  },
  requestUrl: {
    title: "Request URL"
  },
  typ: {
    title: "Type"
  },
  index: {
    title: "Index"
  },
  parentCompany: {
    title: "Parent Company"
  },
  watchlistHash: {
    title: 'Watchlist Hash'
  },
  extraDetail: {
    title: "Extra Detail"
  },
  cookie: {
    title: "Cookie?"
  }
})


/**
 * @class KeywordObject
 * @property {string|RegExp} keyword A keyword we search for
 * @property {number} keywordHash The keywords asssociated hash
 */
export class KeywordObject {
  constructor({ keyword, keywordHash }) {
    this.keyword = keyword
    this.keywordHash = keywordHash
  }
}


/**
 * @enum {string} Enum used to reference file formats that are available for export
 */
export const exportTypeEnum = Object.freeze({
  JSON: "JSON",
  TSV: "tsv",
})

/**
 * @enum {number} Enum used to convert times to milliseconds. (Date.now uses milliseconds)
 * allTime uses a 50 year bound.
 */
export const timeRangeEnum = Object.freeze({
  lastMinute: {
    timestamp: 60000,
    title: "Last Minute",
  },
  lastHour: {
    timestamp: 3.6e6,
    title: "Last Hour",
  },
  lastDay: {
    timestamp: 8.64e7,
    title: "Last Day",
  },
  lastWeek: {
    timestamp: 6.048e8,
    title: "Last Week",
  },
  lastMonth: {
    timestamp: 2.628e9,
    title: "Last Month",
  },
  allTime: {
    timestamp: 1.577e12,
    title: "All Time",
  },
})

/**
 * permissions are the broader category that types belong to (see typeEnum)
 * @enum {string} Enum used to reference permissions. Type: String
 */
export const permissionEnum = Object.freeze({
  monetization: "monetization",
  location: "location",
  watchlist: "watchlist",
  tracking: "tracking",
})

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
  fineLocation: "fineLocation",
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
})

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
    toolTip:
      "We will flag instances where the entered keyword is shared with a 3rd party.",
  },
  location: {
    displayName: "Street Address",
    placeholder: {
      streetAddress: "45 Wyllys Ave",
      city: "Middletown",
      state: "CT",
      zipCode: "06459",
    },
    toolTip:
      "We will flag instances where the entered location data is shared with a 3rd party.",
  },
  phoneNumber: {
    displayName: "Phone Number",
    placeholder: "+1 (860) 685-2000",
    toolTip:
      "We will flag instances where the entered phone number is shared with a 3rd party.",
  },
  emailAddress: {
    displayName: "Email Address",
    placeholder: "jdoe@wesleyan.edu",
    toolTip:
      "We will flag instances where the entered email is shared with a 3rd party,  both in the form you write it  and in an alternate representation (The Trade Desk's UID)",
  },
  ipAddress: {
    displayName: "IP Address",
    placeholder: "999.99.999.999",
    toolTip:
      "Google: What's my IP?. We will only flag instances where your IP is shared with a 3rd party. All websites you connect to have access to your IP address.",
  },
})

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
        link: "https://disconnect.me/trackerprotection#categories-of-trackers",
      },
      analytics: {
        displayName: "Analytics",
        description: "An Analytics company sent or received your data.",
        link: "https://disconnect.me/trackerprotection#categories-of-trackers",
      },
      social: {
        displayName: "Social",
        description: "A Social media company sent or received your data.", 
        link: "https://disconnect.me/trackerprotection#categories-of-trackers", 
      },
    },
  },
  location: {
    displayName: "Location",
    description: "Your location was found in your web traffic.",
    types: {
      coarseLocation: {
        displayName: "Coarse Location",
        description:
          "Your Coarse Location (imprecise coordinates) was found in your web traffic.", 
        link: "https://myshadow.org/location-tracking",
      },
      fineLocation: {
        displayName: "Fine Location",
        description:
          "Your Fine Location (precise coordinates) was found in your web traffic.",
          link: "https://myshadow.org/location-tracking",
      },
      zipCode: {
        displayName: "Zip Code",
        description: "Your Zip Code was found in your web traffic.",
        link: "https://myshadow.org/location-tracking",
      },
      streetAddress: {
        displayName: "Street Address",
        description: "Your Street Address was found in your web traffic.",
        link: "https://myshadow.org/location-tracking",
      },
      city: {
        displayName: "City",
        description: "Your City was found in your web traffic.",
        link: "https://myshadow.org/location-tracking",
      },
      state: {
        displayName: "State",
        description: "Your State was found in your web traffic.",
        link: "https://myshadow.org/location-tracking",
      },
    },
  },
  watchlist: {
    displayName: "Watchlist",
    description: "Data based on your custom watchlist inputs.",
    types: {
      phoneNumber: {
        displayName: "Phone Number",
        description:
          "A Phone Number from your watchlist was found in your web traffic.",
        link: "https://www.consumer.ftc.gov/blog/2016/09/how-did-company-get-my-info",
      },
      emailAddress: {
        displayName: "Email Address",
        description:
          "An Email Address from your watchlist was found in your web traffic.", 
        link: "https://www.consumer.ftc.gov/blog/2016/09/how-did-company-get-my-info",
      },
      encodedEmail: {
        displayName: "Encoded Email",
        description:
          "An Email Address from your watchlist was found in your web traffic in an alternate representation (e.g., The Trade Desk's UID)",
        link: "https://www.thetradedesk.com/us/about-us/industry-initiatives/unified-id-solution-2-0",
      },

      userKeyword: {
        displayName: "Keyword",
        description: "A Keyword from your watchlist was found in your web traffic.",
        link: "https://www.privacytechlab.org/", // link to our own article once available
      },
    },
  },
  tracking: {
    displayName: "Tracking",
    description: "A tracking practice was found in your web traffic.",
    types: {
      trackingPixel: {
        displayName: "Tracking Pixel",
        description:
          "A Tracking Pixel (or web beacon) is code that silently pings a third-party to track your web activity.",
        link: "https://en.wikipedia.org/wiki/Web_beacon",
      },
      possiblePixel: {
        displayName: "Possible Tracking Pixel",
        description:
          "A Tracking Pixel (or web beacon) is code that silently pings a third-party to track your web activity.",
        link: "https://en.wikipedia.org/wiki/Web_beacon", 
      },
      ipAddress: {
        displayName: "IP Address",
        description:
          "Your IP Address identifies your modem and can be used to identify your location.",
        link: "https://iapp.org/news/a/are-ip-addresses-generated-when-users-visit-websites-personal-information/",
      },
      fingerprinting: {
        displayName: "Browser Fingerprinting",
        description:
          "Browser Fingerprinting is a practice that uniquely identifies your browser based on your screen size, OS, language, and other metadata.",
        link: "https://en.wikipedia.org/wiki/Device_fingerprint",
      },
    },
  },
})

/**
 * settingsModelsEnum object to remove strings from codebase
 * named models to not confuse with theme settings in src/libs/settings
 * @enum string
 */
export const settingsModelsEnum = Object.freeze({
  fullSnippet: "fullSnippet",
  tour: "tour",
  optimizePerformance: "optimizePerformance",
  ipLayer: "ipLayer"
})
