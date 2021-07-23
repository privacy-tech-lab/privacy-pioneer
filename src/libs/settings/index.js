import { settingsKeyval, watchlistKeyval } from "../indexed-db"
import {
  permissionEnum,
  storeEnum,
} from "../../background/analysis/classModels"
import { evidenceKeyval } from "../../background/analysis/interactDB/openDB"

export const settingsEnum = Object.freeze({
  sameAsSystem: "sameAsSystem",
  dark: "dark",
  light: "light",
  json: "json",
  yaml: "yaml",
})

export const setDefault = async () => {
  if ((await settingsKeyval.values()).length == 0) {
    await settingsKeyval.set(permissionEnum.location, true)
    await settingsKeyval.set(permissionEnum.monetization, true)
    await settingsKeyval.set(permissionEnum.tracking, true)
    await settingsKeyval.set(permissionEnum.watchlist, true)
    await settingsKeyval.set("theme", settingsEnum.sameAsSystem)
  }
}

export const toggleLabel = async (label) => {
  let currentVal = await settingsKeyval.get(label)
  if (Object.values(permissionEnum).includes(label)) {
    await settingsKeyval.set(label, !currentVal)
  }
}

export const getLabelStatus = async () => {
  let labelStatus = {}
  for (const label of Object.values(permissionEnum)) {
    labelStatus[label] = await settingsKeyval.get(label)
  }
  return labelStatus
}

export const setTheme = async (theme) => {
  await settingsKeyval.set("theme", theme)
}

export const getTheme = async () => {
  return await settingsKeyval.get("theme")
}

export const deleteEvidenceDB = async () => {
  await evidenceKeyval.clear(storeEnum.firstParty)
  await evidenceKeyval.clear(storeEnum.thirdParty)
}

export const deleteKeywordDB = async () => {
  await watchlistKeyval.clear()
}

export const getExcludedLabels = async () => {
  let excludedLabels = []
  let labels = Object.values(permissionEnum)
  for (const label of labels) {
    let include = await settingsKeyval.get(label)
    if (!include) {
      excludedLabels.push(label)
    }
  }
  return excludedLabels
}
