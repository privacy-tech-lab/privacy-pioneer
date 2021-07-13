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
  tabUpdate,
} from "./analysis/analyze.js";
import { importData } from "./analysis/importSearchData.js";
import { openDB } from "idb";
import { settingsKeyval } from "../libs/indexed-db/index.js";
import { setDefault } from "../libs/settings/index.js";

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
    "websocket",
    "main_frame",
    "image",
  ],
};

// Get url of active tab for popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg == "background.currentTab") {
    // send current, open tab to the runtime (our extension)
    const send = (tabs) =>
      browser.runtime.sendMessage({
        msg: "popup.currentTab",
        data: tabs[0].url,
      });
    // get the current open tab (is a promise)
    const querying = browser.tabs.query({ active: true, currentWindow: true });
    // once all open visible tabs have been added to querying, send to runtime
    querying.then(
      (tabs) => send(tabs),
      (error) => send("")
    );
  }
});

// call function to get all the url and keyword data
importData().then((data) => {
  /**
   * Re-imports data to be passed to analysis on update
   * @listens dataUpdatedMessage
   */
  browser.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (request.msg == "dataUpdated") {
        data = await importData();
      }
    }
  );
  /**
   * calls tabUpdate callback on tabChange
   * @listens tabUpdateEvent
   */
  browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    tabUpdate(tabId, changeInfo, tab, data);
  });

  // Listener to get response data, request body, and details about request
  browser.webRequest.onBeforeRequest.addListener(
    function (details) {
      onBeforeRequest(details, data);
    },
    filter,
    ["requestBody", "blocking"]
  );

  // Listener to get request headers
  // Note: I'm not sure if there is a difference between the details of a request here and onBeforeRequest
  // maybe timestamp difference, antyhing else important?
  browser.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
      onBeforeSendHeaders(details, data);
    },
    filter,
    ["requestHeaders"]
  );

  // Listener to get response headers
  // Note: I'm not sure if there is a difference between the details of a request here and onBeforeRequest
  // maybe timestamp differece, antyhing else important?
  browser.webRequest.onResponseStarted.addListener(
    function (details) {
      onHeadersReceived(details, data);
    },
    filter,
    ["responseHeaders"]
  );
});

async function initDB(initArr) {
  for (let initItem of initArr) {
    let key, keyword, type, id;
    [key, keyword, type, id] = initItem;
    watchlistKeyval.set(key, {
      keyword: keyword,
      type: type,
      id: id,
    });
  }
}

setDefault();
