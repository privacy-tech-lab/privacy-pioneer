/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

/*
background.js
================================================================================
- background.js is the entry point to all background related tasks
- to explore the lifecycle of a network request and other extension network apis see below
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest
*/

import {
  onBeforeRequest,
  onBeforeSendHeaders,
  onHeadersReceived,
} from "./analysis/analyze.js"
import { setDefault } from "../libs/settings/index.js"
import { importData } from "./analysis/buildUserData/importSearchData.js"
import Queue from "queue"

// A filter that restricts the events that will be sent to a listener.
// You can play around with the urls and types.
// Maybe its the way I parse the data, but images and video won't load if I don't filter them out.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/RequestFilter
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
const filter = {
  urls: ["<all_urls>"],
  types: [
    "script",
    "xmlhttprequest",
    "sub_frame",
    "image",
  ],
}

// initialize the evidenceQ that will add evidence to the DB as we get it.
export var evidenceQ = Queue({ results: [], concurrency: 1, autostart: true })

// Get url of active tab for popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg == "background.currentTab") {
    // send current, open tab to the runtime (our extension)
    const send = (tabs) =>
      browser.runtime.sendMessage({
        msg: "popup.currentTab",
        data: tabs[0].url,
      })
    // get the current open tab (is a promise)
    const querying = browser.tabs.query({ active: true, currentWindow: true })
    // once all open visible tabs have been added to querying, send to runtime
    querying.then(
      (tabs) => send(tabs),
      (error) => send("")
    )
  }
})

// call function to get all the url and keyword data
importData().then((data) => {
  /**
   * Re-imports data to be passed to analysis on update
   * @listens dataUpdatedMessage
   */
  browser.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (request.msg == "dataUpdated") {
        data = await importData()
      }
    }
  )

  // Listener to get response data, request body, and details about request
  browser.webRequest.onBeforeRequest.addListener(
    function (details) {
      onBeforeRequest(details, data)
    },
    filter,
    ["requestBody", "blocking"]
  )

  // Listener to get request headers
  // Note: I'm not sure if there is a difference between the details of a request here and onBeforeRequest
  // maybe timestamp difference, antyhing else important?
  browser.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
      onBeforeSendHeaders(details, data)
    },
    filter,
    ["requestHeaders"]
  )

  // Listener to get response headers
  // Note: I'm not sure if there is a difference between the details of a request here and onBeforeRequest
  // maybe timestamp differece, antyhing else important?
  browser.webRequest.onResponseStarted.addListener(
    function (details) {
      onHeadersReceived(details, data)
    },
    filter,
    ["responseHeaders"]
  )
})

async function initDB(initArr) {
  for (let initItem of initArr) {
    let key, keyword, type, id;
    [key, keyword, type, id] = initItem
    watchlistKeyval.set(key, {
      keyword: keyword,
      type: type,
      id: id,
    })
  }
}

setDefault()

/**
 * Gets a callback with downloadDelta every time downloads have been changed.
 * If it is our download and it's done, we revoke the URL.
 * Revokes the object URL after a download has been successfully completed or interrupted.
 * downloadDelta: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/onChanged#downloaddelta
 */
browser.downloads.onChanged.addListener(async function (downloadDelta) {
  const status = downloadDelta.state.current
  // if the download is finished, we fetch the url for the download and revoke that object URL
  if (status === "complete" || status === "interrupted") {
    const id = downloadDelta.id
    const downloadItemArr = await browser.downloads.search({ id: id })
    const downloadItem = downloadItemArr[0] // search returns an array. We will get length 1 array because id's are unique
    const url = downloadItem.url
    const filename = downloadItem.filename
    // we only revoke the URL if it is the download we initiated
    if (filename.includes("privacy_pioneer_data")) {
      URL.revokeObjectURL(url) // revoke the url.
    }
  }
})
