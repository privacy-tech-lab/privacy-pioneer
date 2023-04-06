/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { analyticsKeyval, settingsKeyval, watchlistKeyval } from "../openDB.js";
import {
  settingsModelsEnum,
  permissionEnum,
} from "../../../background/analysis/classModels";
import { evidenceKeyval } from "../../../background/analysis/interactDB/openDB";
import { loadModel } from "../../../background/analysis/interactDB/ml/jsrun.js";

export const settingsEnum = Object.freeze({
  dark: "dark",
  light: "light",
  json: "json",
  yaml: "yaml",
});

/**
 * Sets all labels on in settings, theme (colors) to be system setting
 */
export const setDefaultSettings = async () => {
  if ((await settingsKeyval.values()).length == 0) {
    await settingsKeyval.set(permissionEnum.location, true);
    await settingsKeyval.set(permissionEnum.monetization, true);
    await settingsKeyval.set(permissionEnum.tracking, true);
    await settingsKeyval.set(permissionEnum.personal, true);
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    await settingsKeyval.set(
      "theme",
      darkTheme.matches ? settingsEnum.dark : settingsEnum.light
    );
    await settingsKeyval.set(settingsModelsEnum.fullSnippet, false);
    await settingsKeyval.set(settingsModelsEnum.tour, true);
    await settingsKeyval.set("alreadyNotified", {});
    await settingsKeyval.set(settingsModelsEnum.optimizePerformance, true);
    await settingsKeyval.set(settingsModelsEnum.extensionEnabled, true);
    await settingsKeyval.set("firstHomeVisit", true);
    await analyticsKeyval.set(settingsModelsEnum.analytics, true);
    browser.tabs.create({ url: browser.runtime.getURL("options.html") });
  }

  loadModel();
};

/**
 * Toggles labels on or off
 * @param {string} label label we generated
 */
export const toggleLabel = async (label) => {
  let currentVal = await settingsKeyval.get(label);
  if (Object.values(permissionEnum).includes(label)) {
    await settingsKeyval.set(label, !currentVal);
  }
};

/**
 * Tells whether the labels are on or off based on settings
 */
export const getLabelStatus = async () => {
  let labelStatus = {};
  for (const label of Object.values(permissionEnum)) {
    labelStatus[label] = await settingsKeyval.get(label);
  }
  return labelStatus;
};

export const getExtensionStatus = async () => {
  return await settingsKeyval.get(settingsModelsEnum.extensionEnabled);
};

export const toggleExtension = async () => {
  const extensionEnabled = await getExtensionStatus();
  await settingsKeyval.set(
    settingsModelsEnum.extensionEnabled,
    !extensionEnabled
  );
  return !extensionEnabled;
};

/**
 * Toggles snippets on or off
 * @param {string} label label we generated
 */
export const toggleSnippet = async () => {
  let currentVal = await settingsKeyval.get(settingsModelsEnum.fullSnippet);
  await settingsKeyval.set(settingsModelsEnum.fullSnippet, !currentVal);
  browser.runtime.sendMessage({ msg: "dataUpdated" });
};

/**
 * Tells whether the labels are on or off based on settings
 */
export const getSnippetStatus = async () => {
  return await settingsKeyval.get(settingsModelsEnum.fullSnippet);
};

/**
 * Toggles optimization on or off
 * @param {string} label label we generated
 */
export const toggleOptimization = async () => {
  let currentVal = await settingsKeyval.get(
    settingsModelsEnum.optimizePerformance
  );
  await settingsKeyval.set(settingsModelsEnum.optimizePerformance, !currentVal);
  browser.runtime.sendMessage({ msg: "dataUpdated" });
};

/**
 * Tells whether optimization is on or off based on settings
 */
export const getOptimizationStatus = async () => {
  return await settingsKeyval.get(settingsModelsEnum.optimizePerformance);
};

/**
 * Toggles analytics on or off
 * @param {string} label label we generated
 */
export const toggleAnalytics = async () => {
  let currentVal = await analyticsKeyval.get(settingsModelsEnum.analytics);
  await analyticsKeyval.set(settingsModelsEnum.analytics, !currentVal);
  browser.runtime.sendMessage({ msg: "dataUpdated" });
};

/**
 * Tells whether analytics is on or off based on settings
 */
export const getAnalyticsStatus = async () => {
  return await analyticsKeyval.get(settingsModelsEnum.analytics);
};

/**
 * Sets the theme to be light, dark, or system
 * @param {string} theme desired theme (colors)
 */
export const setTheme = async (theme) => {
  await settingsKeyval.set("theme", theme);
};

/**
 * Gets theme (color)
 */
export const getTheme = async () => {
  return await settingsKeyval.get("theme");
};

/**
 * delete all evidence
 */
export const deleteEvidenceDB = async () => {
  await evidenceKeyval.clear();
};

/**
 * delete everything in watchlist
 */
export const deleteKeywordDB = async () => {
  await watchlistKeyval.clear();
};

/**
 * Obtains the labels the user has turned off
 * @returns labels the user turned off
 */
export const getExcludedLabels = async () => {
  let excludedLabels = [];
  let labels = Object.values(permissionEnum);
  for (const label of labels) {
    let include = await settingsKeyval.get(label);
    if (!include) {
      excludedLabels.push(label);
    }
  }
  return excludedLabels;
};

export const getTourStatus = async () => {
  return await settingsKeyval.get(settingsModelsEnum.tour);
};

export const startStopTour = async () => {
  const touring = await settingsKeyval.get(settingsModelsEnum.tour);
  await settingsKeyval.set(settingsModelsEnum.tour, !touring);
};
