import { evidenceKeyval } from "../../background/analysis/interactDB/openDB"
import { getHostname } from "../../background/analysis/utility/util"
import { settingsKeyval, watchlistKeyval } from "./openDB"

const getPermittedNotifications = async () => {
  let permittedKeywords = []
  const watchlistKeywords = await watchlistKeyval.values()
  watchlistKeywords.forEach((keyword) => {
    if (keyword.notification) permittedKeywords.push(keyword.id)
  })
  return permittedKeywords
}
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

export const notify = async (url) => {
  const host = getHostname(url)
  evidenceKeyval.get(host).then(async (res) => {
    if (res && res.watchlist) {
      const evidenceToNotify = await getUnnotifiedEvidence(res.watchlist)
      if (Notification.permission == "granted" && evidenceToNotify.length > 0) {
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
