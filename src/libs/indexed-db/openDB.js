/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { openDB } from "idb";

/**
 * Create/open indexed-db to store keywords for watchlist
 */
const dbPromise = openDB("UserData-store", 1, {
  upgrade(db) {
    db.createObjectStore("watchlist");
    db.createObjectStore("userSettings");
    db.createObjectStore("userAnalytics");
  },
});

/**
 * Wrapper functions for CRUD operations of 'watchlist' indexed-db
 */
export const watchlistKeyval = {
  /**
   * @param {string} key
   */
  async get(key) {
    return (await dbPromise).get("watchlist", key);
  },
  /**
   * @param {string} key
   * @param {object} val
   */
  async set(key, val) {
    return (await dbPromise).put("watchlist", val, key);
  },
  /**
   * @param {string} key
   */
  async delete(key) {
    return (await dbPromise).delete("watchlist", key);
  },
  async clear() {
    return (await dbPromise).clear("watchlist");
  },
  async keys() {
    return (await dbPromise).getAllKeys("watchlist");
  },
  async values() {
    return (await dbPromise).getAll("watchlist");
  },
};

export const settingsKeyval = {
  /**
   * @param {string} key
   */
  async get(key) {
    return (await dbPromise).get("userSettings", key);
  },
  /**
   * @param {string} key
   * @param {object} val
   */
  async set(key, val) {
    return (await dbPromise).put("userSettings", val, key);
  },
  /**
   * @param {string} key
   */
  async delete(key) {
    return (await dbPromise).delete("userSettings", key);
  },
  async clear() {
    return (await dbPromise).clear("userSettings");
  },
  async keys() {
    return (await dbPromise).getAllKeys("userSettings");
  },
  async values() {
    return (await dbPromise).getAll("userSettings");
  },
};

export const analyticsKeyval = {
  /**
   * @param {string} key
   */
  async get(key) {
    return (await dbPromise).get("userAnalytics", key);
  },
  /**
   * @param {string} key
   * @param {object} val
   */
  async set(key, val) {
    return (await dbPromise).put("userAnalytics", val, key);
  },
  /**
   * @param {string} key
   */
  async delete(key) {
    return (await dbPromise).delete("userAnalytics", key);
  },
  async clear() {
    return (await dbPromise).clear("userAnalytics");
  },
  async keys() {
    return (await dbPromise).getAllKeys("userAnalytics");
  },
  async values() {
    return (await dbPromise).getAll("userAnalytics");
  },
};