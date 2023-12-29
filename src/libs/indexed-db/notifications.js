/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { evidenceKeyval } from "../../background/analysis/interactDB/openDB";
import { getHostname } from "../../background/analysis/utility/util";
import { settingsKeyval, watchlistKeyval } from "./openDB";
import { Evidence, privacyLabels } from "../../background/analysis/classModels";

export async function requestNotificationPermission() {
  if (Notification.permission == "default") {
    if (confirm(
      "Privacy Pioneer will notify you of any selected Watchlist Keywords appearing in your web requests."
    )) {
      const res = await Notification.requestPermission();
      return res === "granted";
    }
  }
}

/**
 * @returns {Promise<object[]>} list of watchlist items that have notifications on
 */
const getPermittedNotifications = async () => {
  let permittedKeywords = [];
  const watchlistKeywords = await watchlistKeyval.values();
  watchlistKeywords.forEach((keyword) => {
    if (keyword.notification) permittedKeywords.push(keyword.id);
  });
  return permittedKeywords;
}


/**
 * @param {object} allEvidence evidence of a given url
 * @param {string} host
 * @returns {Promise<Evidence[]>} of watchlist evidence that hasn't been notified to user
 */
const getUnnotifiedEvidence = async (allEvidence, host) => {
  const alreadyNotified = await settingsKeyval.get("alreadyNotified");
  const hostAlreadyNotified = alreadyNotified[host] ?? [];
  const permittedKeywords = await getPermittedNotifications();
  const unnotifiedEvidence = [];
  Object.keys(allEvidence).forEach((perm) => {
    Object.keys(allEvidence[perm]).forEach((type) => Object.keys(allEvidence[perm][type]).forEach((evidence) => {
      if (allEvidence[perm][type][evidence]["watchlistHash"] &&
        permittedKeywords.includes(
          allEvidence[perm][type][evidence]["watchlistHash"]
        ) &&
        allEvidence[perm][type][evidence]["permission"] !== "personal") {
        allEvidence[perm][type][evidence]["watchlistHash"];
        if (!hostAlreadyNotified.includes(evidence)) {
          if (!unnotifiedEvidence.includes(
            allEvidence[perm][type][evidence]["watchlistHash"]
          )) {
            unnotifiedEvidence.push(allEvidence[perm][type][evidence]);
          }
          hostAlreadyNotified.push(evidence);
        }
      } else if (allEvidence[perm][type][evidence][0] !== undefined) {
        allEvidence[perm][type][evidence].forEach((personalEvidence) => {
          if (personalEvidence.timestamp + 19000 > Date.now()) {
            notifyPersonal(host, personalEvidence);
          }
        });
      } else if (allEvidence[perm][type][evidence]["permission"] === "personal") {
        if (allEvidence[perm][type][evidence]["timestamp"] + 19000 > Date.now()) {
          notifyPersonal(host, allEvidence[perm][type][evidence]);
        }
      }
    })
    );
  });

  alreadyNotified[host] = hostAlreadyNotified;
  await settingsKeyval.set("alreadyNotified", alreadyNotified);
  return unnotifiedEvidence;
}

/**
 * Notifies user of any evidence containing watchlist data from given url
 * @param {string} host
 */
const notify = async (host) => {
  if (Notification.permission == "granted") {
    evidenceKeyval.get(host).then(async (res) => {
      if (res) {
        const evidenceToNotify = await getUnnotifiedEvidence(res, host);
        if (evidenceToNotify.length > 0) {
          let evidenceList = "";

          for (const evidence of evidenceToNotify) {
            const displayName = privacyLabels[evidence.permission]["types"][evidence.typ]
              .displayName;
            evidenceList = evidenceList + `\n${displayName}`;
          }

          const text = `We found the following watchlist keywords in your web request: \n${evidenceList}`;

          //@ts-ignore
          browser.notifications.create("privacy_pioneer" + host, {
            type: "basic",
            message: text,
            title: "Privacy Pioneer",
          });
        }
      }
    });
  }
}

/**
 * Notifies user of any evidence containing watchlist data from given url
 * @param {string} host
 * @param {Evidence} evidence
 */
const notifyPersonal = async (host, evidence) => {
  if (Notification.permission == "granted") {
    const keyword = (await watchlistKeyval.get(evidence.watchlistHash.toString())).keyword;
    const displayName = privacyLabels[evidence.permission]["types"][evidence.typ].displayName;
    const evidenceList = `\n${displayName} (${keyword.slice(0, 3)}**)`;

    const text = `We found the following watchlist keywords in your web request: \n${evidenceList}`;

    //@ts-ignore
    browser.notifications.create("privacy_pioneer" + host, {
      type: "basic",
      message: text,
      title: "Privacy Pioneer",
    });
  }
}

/**
 * Runs every time the active tab is switched. Checks session storage for host and if
 * not present it will run the notify function.
 */
export const runNotifications = async () => {
  //@ts-ignore
  browser.webNavigation.onCompleted.addListener(async (details) => {
    const activeTab = (
      //@ts-ignore
      await browser.tabs.query({ currentWindow: true, active: true })
    )[0];
    const host = getHostname(activeTab.url);
    if (details.frameId === 0 && details.tabId === activeTab.id) {
      const timeoutId = setTimeout(() => {
        //@ts-ignore
        browser.tabs.onUpdated.removeListener(handleTabUpdated);
        //@ts-ignore
        browser.tabs.onRemoved.removeListener(handleTabClosed);
        notify(host);
      }, 15000);

      function handleTabUpdated(tabInfo) {
        const updatedHost = getHostname(tabInfo.url);
        if (updatedHost != host) {
          clearTimeout(timeoutId);
          notify(host);
        }
      }

      function handleTabClosed(closedTabId) {
        if (activeTab.id === closedTabId) {
          clearTimeout(timeoutId);
          notify(host);
        }
      }

      //@ts-ignore
      browser.tabs.onUpdated.addListener(handleTabUpdated, {
        tab: activeTab.id,
        properties: ["url"],
      });
      //@ts-ignore
      browser.tabs.onRemoved.addListener(handleTabClosed);
    }
  });
}