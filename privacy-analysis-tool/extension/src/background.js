browser.browserAction.onClicked.addListener(function (activeTab) {
  browser.tabs.create({ url: browser.runtime.getURL("dashboard/index.html") });
});

browser.runtime.onInstalled.addListener(function (object) {
  //browser.tabs.update({ url: browser.runtime.getURL("dashboard/index.html") });
});
