/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { evidenceKeyval } from "../../background/analysis/interactDB/openDB";
import { getHostname } from "../../background/analysis/utility/util";
import { settingsKeyval, watchlistKeyval } from "./openDB";
import { privacyLabels } from "../../background/analysis/classModels";

export const requestNotificationPermission = async () => {
  if (Notification.permission == "default") {
    if (
      confirm(
        "Privacy Pioneer will notify you of any selected Watchlist Keywords appearing in your web requests."
      )
    ) {
      const res = await Notification.requestPermission();
      return res === "granted";
    }
  }
};

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
  Object.keys(allEvidence).forEach((perm) => {
    Object.keys(allEvidence[perm]).forEach((type) =>
      Object.keys(allEvidence[perm][type]).forEach((evidence) => {
        if (
          allEvidence[perm][type][evidence]["watchlistHash"] &&
          permittedKeywords.includes(
            allEvidence[perm][type][evidence]["watchlistHash"]
          ) &&
          allEvidence[perm][type][evidence]["permission"] !== "personal"
        ) {
          allEvidence[perm][type][evidence]["watchlistHash"];
          if (!hostAlreadyNotified.includes(evidence)) {
            if (
              !unnotifiedEvidence.includes(
                allEvidence[perm][type][evidence]["watchlistHash"]
              )
            ) {
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
            notifyPersonal(host, allEvidence[perm][type][evidence])
          }
        }
      })
    );
  });

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
        const evidenceToNotify = await getUnnotifiedEvidence(res, host);
        if (evidenceToNotify.length > 0) {
          let evidenceList = "";

          for (const evidence of evidenceToNotify) {
            const displayName =
              privacyLabels[evidence.permission]["types"][evidence.typ]
                .displayName;
            evidenceList = evidenceList + `\n${displayName}`;
          }

          const text = `We found the following watchlist keywords in your web request: \n${evidenceList}`;

          browser.notifications.create("privacy_pioneer" + host, {
            type: "basic",
            message: text,
            title: "Privacy Pioneer",
          });
        }
      }
    });
  }
};

/**
 *
 * @param {string} host
 * @param {evidence} evidence
 *
 * Notifies user of any evidence containing watchlist data from given url
 */
const notifyPersonal = async (host, evidence) => {
  if (Notification.permission == "granted") {
    const keyword = (await watchlistKeyval.get(evidence.watchlistHash)).keyword;
    const displayName =
      privacyLabels[evidence.permission]["types"][evidence.typ].displayName;
    const evidenceList = `\n${displayName} (${keyword.slice(0, 3)}**)`;

    const text = `We found the following watchlist keywords in your web request: \n${evidenceList}`;

    browser.notifications.create("privacy_pioneer" + host, {
      type: "basic",
      message: text,
      title: "Privacy Pioneer",
    });
  }
};

/**
 * Runs every time the active tab is switched. Checks session storage for host and if
 * not present it will run the notify function.
 */

const runNotifications = async () => {
  browser.webNavigation.onCompleted.addListener(async (details) => {
    const activeTab = (
      await browser.tabs.query({ currentWindow: true, active: true })
    )[0];
    const host = getHostname(activeTab.url);
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
          clearTimeout(timeoutId);
          notify(host);
        }
      };

      browser.tabs.onUpdated.addListener(handleTabUpdated, {
        tabId,
        properties: ["url"],
      });
      browser.tabs.onRemoved.addListener(handleTabClosed);
    }
  });
};

export { runNotifications };
