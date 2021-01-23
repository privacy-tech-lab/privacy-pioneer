/* 
background.js
================================================================================
- background.js is the entry point to all background related tasks
*/

import { analyzeRequests } from "./analyze.js"

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    analyzeRequests(details)
  },
  { urls: ["<all_urls>"] },
  ["requestBody", "extraHeaders"]
)
