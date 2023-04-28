/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { watchlistKeyval } from "./openDB.js";
import { evidenceKeyval as evidenceIDB } from "../../background/analysis/interactDB/openDB.js";
import { watchlistHashGen } from "../../background/analysis/utility/util.js";
import {
  keywordTypes,
  permissionEnum,
} from "../../background/analysis/classModels.js";
import {
  IPINFO_IPKEY,
  IPINFO_ADDRESSKEY,
} from "../../background/analysis/buildUserData/importSearchData.js";
import { requestNotificationPermission } from "./notifications.js";

/**
 * Saves/updates keyword from watchlist store
 * Updates keyword when 'id' is not undefined
 *
 * @param {keyword}
 * @param {type}
 * @param {id}
 * @returns {Promise<Boolean>} True if successful, false otherwise
 */
const saveKeyword = async (keyword, type, id) => {
  // Validate
  if (type in keywordTypes && keyword) {
    const notificationEnabled = Notification.permission == "granted";
    let key;
    //id == ip || loc when this is the ipinfo generated ip keyword
    if (id == "ip") {
      key = IPINFO_IPKEY;
    } else if (id == "loc") {
      key = IPINFO_ADDRESSKEY;
      let watchlist = await watchlistKeyval.values();
      var maxNum = 0;
      watchlist.forEach((el) => {
        if (el.type == permissionEnum.location) {
          maxNum = Math.max(maxNum, el.locNum);
        }
      });
      maxNum = (maxNum + 1).toString();
    } else if (id != null) {
      key = id;
    } else if (type == permissionEnum.location) {
      let watchlist = await watchlistKeyval.values();
      var maxNum = 0;
      watchlist.forEach((el) => {
        if (el.type == permissionEnum.location) {
          maxNum = Math.max(maxNum, el.locNum);
        }
      });
      maxNum = (maxNum + 1).toString();
      key = watchlistHashGen(type, maxNum);
    } else {
      key = watchlistHashGen(type, keyword);
    }
    type != permissionEnum.location
      ? await watchlistKeyval.set(key, {
          keyword: keyword,
          type: type,
          id: key,
          notification: notificationEnabled,
        })
      : await watchlistKeyval.set(key, {
          location: keyword,
          type: type,
          id: key,
          locNum: maxNum,
          notification: notificationEnabled,
        });
    return true;
  }
  return false;
};

const toggleNotifications = async (id) => {
  const data = await watchlistKeyval.get(id);
  if (data.notification) {
    data.notification = false;
  } else {
    const permission = await requestNotificationPermission();
    if (Notification.permission === "denied") {
      alert(
        "Please turn on notifications in order to receives alerts about your watchlist keywords!"
      );
    } else if (permission || Notification.permission === "granted") {
      data.notification = true;
    }
  }
  watchlistKeyval.set(id, data);
};

/**
 * Deletes the keyword from the watchlist.
 * Deletes the evidence associated with that keyword from the evidenceDB
 *
 * @param {number} id
 * @param {string} type
 * @returns {void} Nothing. Updates and deletes as described.
 */
const deleteKeyword = async (id) => {
  let evKeys = await evidenceIDB.keys();
  /**
   * Deletes evidence if watchlistHash of the evidence is the same as the id we are deleting from the watchlist
   * @param {Object} evidenceStoreKeys All keys from the related store, taken from the above lines
   */
  function runDeletion(evidenceStoreKeys) {
    evidenceStoreKeys.forEach(async (website) => {
      let a = await evidenceIDB.get(website);
      if (a == undefined) {
        return;
      } // shouldn't happen but just in case
      for (const [perm, typeLevel] of Object.entries(a)) {
        for (const [type, evUrls] of Object.entries(typeLevel)) {
          for (const [evUrl, evidence] of Object.entries(evUrls)) {
            if (id == evidence.watchlistHash) {
              delete a[perm][type][evUrl];
            }
          }
          if (Object.keys(a[perm][type]).length == 0) {
            delete a[perm][type];
          }
        }
      }
      await evidenceIDB.set(website, a);
    });
  }

  // delete from Evidence
  runDeletion(evKeys);

  // delete from watchlist
  await watchlistKeyval.delete(id);

  // reset the datastream
  browser.runtime.sendMessage({ msg: "dataUpdated" });
};

export { saveKeyword, deleteKeyword, toggleNotifications };
