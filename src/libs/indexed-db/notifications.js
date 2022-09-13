import { FIVE_SEC_IN_MILLIS } from "../../background/analysis/constants"
import { evidenceKeyval } from "../../background/analysis/interactDB/openDB"
import { getHostname } from "../../background/analysis/utility/util"
import { settingsKeyval, watchlistKeyval } from "./openDB"

/**
 *
 * @returns list of watchlist items that have notifications on
 */
const getPermittedNotifications = async () => {
  let permittedKeywords = []
  const watchlistKeywords = await watchlistKeyval.values()
  watchlistKeywords.forEach((keyword) => {
    if (keyword.notification) permittedKeywords.push(keyword.id)
  })
  return permittedKeywords
}
/**
 *
 * @param {object} watchlistEvidence evidemce of a given url
 * @returns Array of watchlist evidence that hasn't been notified to user
 */

const getUnnotifiedEvidence = async (watchlistEvidence) => {
  const alreadyNotified = await settingsKeyval.get("alreadyNotified")
  const permittedKeywords = await getPermittedNotifications()
  const unnotifiedEvidence = []

  Object.keys(watchlistEvidence).forEach((type) =>
    Object.keys(watchlistEvidence[type]).forEach((evidence) => {
      if (
        permittedKeywords.includes(
          watchlistEvidence[type][evidence]["watchlistHash"]
        )
      ) {
        if (
          !(
            watchlistEvidence[type][evidence]["timestamp"] in alreadyNotified
          ) &&
          !unnotifiedEvidence.includes(
            watchlistEvidence[type][evidence]["watchlistHash"]
          )
        ) {
          unnotifiedEvidence.push(
            watchlistEvidence[type][evidence]["watchlistHash"]
          )
          alreadyNotified[watchlistEvidence[type][evidence]["timestamp"]] = true
        }
      }
    })
  )
  await settingsKeyval.set("alreadyNotified", alreadyNotified)
  return unnotifiedEvidence
}
/**
 *
 * @param {string} url
 *
 * Notifies user of any evidence containing watchlist data from given url
 */

const notify = async (host) => {
  if (Notification.permission == "granted") {
    evidenceKeyval.get(host).then(async (res) => {
      if (res && res.watchlist) {
        const evidenceToNotify = await getUnnotifiedEvidence(res.watchlist)
        if (evidenceToNotify.length > 0) {
          const text = `${evidenceToNotify.length} keyword${
            evidenceToNotify.length > 1 ? "s" : ""
          } from your watchlist was found in your web traffic. Click the pop up for details!`
          const notif = new Notification("Privacy Pioneer", {
            body: text,
          })
          setTimeout(() => notif.close(), 4000)
        }
      }
    })
  }
}
/**
 * Runs every time the active tab is switched. Checks session storage for host and if
 * not present it will run the notify function.
 */

const runNotifications = () => {
  browser.webNavigation.onDOMContentLoaded.addListener((activeInfo) => {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
      const currentTab = tabs[0]
      const host = getHostname(currentTab.url)
      if (sessionStorage.getItem(host) + FIVE_SEC_IN_MILLIS > Date.now() || sessionStorage.getItem(host) === null) {
        setTimeout(() => {
          notify(host)
          sessionStorage.setItem(host, Date.now())
        }, 3000)
      }
    })
  })
}

export default runNotifications
