import { settingsKeyval } from "../indexed-db";
import { permissionEnum } from "../../background/analysis/classModels";

export const settingsEnum = Object.freeze({
  sameAsSystem: "sameAsSystem",
  dark: "dark",
  light: "light",
  json: "json",
  yaml: "yaml",
});

export const setDefault = async () => {
  await settingsKeyval.set(permissionEnum.location, true);
  await settingsKeyval.set(permissionEnum.monetization, true);
  await settingsKeyval.set(permissionEnum.tracking, true);
  await settingsKeyval.set(permissionEnum.watchlist, true);
  await settingsKeyval.set("theme", settingsEnum.sameAsSystem);
};

export const toggleLabel = async (label) => {
  let currentVal = await settingsKeyval.get(label);
  if (Object.values(permissionEnum).includes(label)) {
    await settingsKeyval.set(label, !currentVal);
  }
};

export const setTheme = async (theme) => {
  await settingsKeyval.set("theme", theme);
  console.log(theme);
};

export const getTheme = async () => {
  return await settingsKeyval.get("theme");
};
