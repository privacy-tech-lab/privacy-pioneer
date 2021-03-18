/*
background.js
================================================================================
- background.js is the entry point to all background related tasks
- to explore the lifecycle of a network request and other extension network apis see below
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest
*/

import { onBeforeRequest, onBeforeSendHeaders, onHeadersReceived } from "./analysis/analyze.js"
import { importData } from "./analysis/importSearchData.js"

// A filter that restricts the events that will be sent to a listener.
// You can play around with the urls and types.
// Maybe its the way I parse the data, but images and video won't load if I don't filter them out.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/RequestFilter
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
const filter = { urls: ["<all_urls>"], types: ["script", "xmlhttprequest", "sub_frame", "websocket" , "main_frame"] }

export var evidence = {}

// call function to get all the url and keyword data
importData()
  .then((data) => {
    var coords = data[0]
    var networkKeywords = data[1]
    var urls = data[2]

    // Listener to get response data, request body, and details about request
    browser.webRequest.onBeforeRequest.addListener(function (details) { onBeforeRequest(details, coords, networkKeywords, urls) }, filter, ["requestBody", "blocking"])

    // Listener to get request headers
    // Note: I'm not sure if there is a difference between the details of a request here and onBeforeRequest
    // maybe timestamp difference, antyhing else important?
    browser.webRequest.onBeforeSendHeaders.addListener(function (details) { onBeforeSendHeaders(details, coords, networkKeywords, urls) }, filter, ["requestHeaders"])

    // Listener to get response headers
    // Note: I'm not sure if there is a difference between the details of a request here and onBeforeRequest
    // maybe timestamp differece, antyhing else important?
    browser.webRequest.onResponseStarted.addListener(function (details) { onHeadersReceived(details, coords, networkKeywords, urls) }, filter, ["responseHeaders"])
  })
