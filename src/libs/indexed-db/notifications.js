/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { FIVE_SEC_IN_MILLIS } from "../../background/analysis/constants";
import { evidenceKeyval } from "../../background/analysis/interactDB/openDB";
import { getHostname } from "../../background/analysis/utility/util";
import { settingsKeyval, watchlistKeyval } from "./openDB";
import { toggleNotifications } from './updateWatchlist'



export const requestNotificationPermission = async () => { 
  if (
        Notification.permission == "default"
      ) {
    const res = await Notification.requestPermission();

    if (res === 'granted') { 
      const watchlistKeys = await watchlistKeyval.keys()
      watchlistKeys.forEach(
        async (key) => { 
          await toggleNotifications(key) 
        }
      )
    }
    
      }
}

/**
 *
 * @returns list of watchlist items that have notifications on
 */
const getPermittedNotifications = async () => {
  let permittedKeywords = [];
  const watchlistKeywords = await watchlistKeyval.values();
  watchlistKeywords.forEach((keyword) => {
    if (keyword.notification) permittedKeywords.push(keyword.id);
  });
  return permittedKeywords;
};
/**
 *
 * @param {object} evidence evidence of a given url
 * @returns Array of watchlist evidence that hasn't been notified to user
 */

const getUnnotifiedEvidence = async (allEvidence, host) => {
  const alreadyNotified = await settingsKeyval.get("alreadyNotified");
  const hostAlreadyNotified = alreadyNotified[host] ?? [];
  const permittedKeywords = await getPermittedNotifications();
  const unnotifiedEvidence = [];
  Object.keys(allEvidence)
    .forEach((perm) =>
      Object.keys(allEvidence[perm]).forEach((type) =>
        Object.keys(allEvidence[perm][type])
          .forEach((evidence) => {
            if (
              allEvidence[perm][type][evidence]["watchlistHash"] &&
              permittedKeywords.includes(
                allEvidence[perm][type][evidence]["watchlistHash"]
              )
            ) {
              allEvidence[perm][type][evidence]["watchlistHash"]
              if (
                !(hostAlreadyNotified.includes(evidence))
              ) {
                if (!unnotifiedEvidence.includes(
                  allEvidence[perm][type][evidence]["watchlistHash"]
                )) { 
                  unnotifiedEvidence.push(
                  allEvidence[perm][type][evidence]["watchlistHash"]
                );
                }
                hostAlreadyNotified.push(evidence);
              };
            };
          })));
  
  alreadyNotified[host] = hostAlreadyNotified;
  await settingsKeyval.set("alreadyNotified", alreadyNotified);
  return unnotifiedEvidence;
};
/**
 *
 * @param {string} url
 *
 * Notifies user of any evidence containing watchlist data from given url
 */

const notify = async (host) => {
  if (Notification.permission == "granted") {
    evidenceKeyval.get(host).then(async (res) => {
      if (res) {
        const evidenceToNotify = await getUnnotifiedEvidence(res,host);
        if (evidenceToNotify.length > 0) {
          const text = `We found ${evidenceToNotify.length} keyword${evidenceToNotify.length > 1 ? 's' : ''} in your web requests on the website at ${host}. Click the popup to learn more!`;
          
          browser.notifications.create("Privacy Pioneer", {
            type:'basic',
            message: text,
            title: "Privacy Pioneer",
          });
        }
      }
    });
  }
};
/**
 * Runs every time the active tab is switched. Checks session storage for host and if
 * not present it will run the notify function.
 */

const runNotifications = async () => {
  browser.webNavigation.onCompleted.addListener(
    async (details) => {
      const activeTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
      const host = getHostname(activeTab.url)
      if (details.frameId === 0 && details.tabId === activeTab.id) { 
        
        const timeoutId = setTimeout(() => {
          browser.tabs.onUpdated.removeListener(handleTabUpdated);
          browser.tabs.onRemoved.removeListener(handleTabClosed);
          notify(host);
        }, 15000);

        const handleTabUpdated = (tabId, changeInfo, tabInfo) => {
          const updatedHost = getHostname(tabInfo.url);
          if (updatedHost != host) {
            clearTimeout(timeoutId);
            notify(host);
          }
        };

        const handleTabClosed = (closedTabId) => {
          if (activeTab.id === closedTabId) {
            clearTimeout(timeoutId)
            notify(host)
          }
        };

        browser.tabs.onUpdated.addListener(handleTabUpdated, { tabId, properties: ['url'] });
        browser.tabs.onRemoved.addListener(handleTabClosed);
      }
  });
};

export default runNotifications;
