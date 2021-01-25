/* 
background.js
================================================================================
- background.js is the entry point to all background related tasks
*/

import { analyzeRequests } from "./analyze.js"
import { httpsCheck } from "./analyze.js"


chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    analyzeRequests(details)
  },
  { urls: ["<all_urls>"] },
  ["requestBody", "extraHeaders"]
)

// listener for page load of active tab
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab)
{
  if (changeInfo.status == 'complete' && tab.active) {
    httpsCheck(tab.url);
  }
});

// listener for switch between tabs
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    httpsCheck(tab.url);
  });
});


