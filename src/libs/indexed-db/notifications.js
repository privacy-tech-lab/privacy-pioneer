/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { FIVE_SEC_IN_MILLIS } from "../../background/analysis/constants";
import { evidenceKeyval } from "../../background/analysis/interactDB/openDB";
import { getHostname } from "../../background/analysis/utility/util";
import { settingsKeyval, watchlistKeyval } from "./openDB";

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

const getUnnotifiedEvidence = async (allEvidence) => {
  const alreadyNotified = await settingsKeyval.get("alreadyNotified");
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
          !(
            allEvidence[perm][type][evidence]["timestamp"] in alreadyNotified
          ) &&
          !unnotifiedEvidence.includes(
            allEvidence[perm][type][evidence]["watchlistHash"]
          )
        ) {
          unnotifiedEvidence.push(
            allEvidence[perm][type][evidence]["watchlistHash"]
          );
          alreadyNotified[
            allEvidence[perm][type][evidence]["timestamp"]
          ] = true;
        }
      }
    })
  ));
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
        const evidenceToNotify = await getUnnotifiedEvidence(res);
        if (evidenceToNotify.length > 0) {
          const text = `${evidenceToNotify.length} keyword${
            evidenceToNotify.length > 1 ? "s" : ""
          } from your watchlist was found in your web traffic. Click the pop up for details!`;
          const notif = new Notification("Privacy Pioneer", {
            body: text,
          });
          setTimeout(() => notif.close(), 4000);
        }
      }
    });
  }
};
/**
 * Runs every time the active tab is switched. Checks session storage for host and if
 * not present it will run the notify function.
 */

const runNotifications = () => {
  browser.webNavigation.onDOMContentLoaded.addListener((activeInfo) => {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
      const currentTab = tabs[0];
      const host = getHostname(currentTab.url);
      if (
        sessionStorage.getItem(host) + FIVE_SEC_IN_MILLIS > Date.now() ||
        sessionStorage.getItem(host) === null
      ) {
        setTimeout(() => {
          notify(host);
          sessionStorage.setItem(host, Date.now());
        }, 3000);
      }
    });
  });
};

export default runNotifications;
