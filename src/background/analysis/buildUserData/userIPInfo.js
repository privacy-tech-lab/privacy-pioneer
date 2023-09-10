/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { evidenceKeyval as evidenceIDB } from "../interactDB/openDB.js";
import {
  buildIpRegex,
  buildZipRegex,
  buildGeneralRegex,
} from "./structuredRoutines.js";

/**
 * deleteFromLocation removes all information pertaining to the watchlist item we are trying to edit
 *
 * @returns {Promise<void>}
 */
async function deleteFromLocation() {
  let evKeys = await evidenceIDB.keys();

  /**
   * Deletes evidence if watchlistHash of the evidence is the same as the id we are deleting from the watchlist
   * @param {object} evidenceStoreKeys All keys from the related store, taken from the above lines
   * @returns {void} Side effects only
   */
  function runRegIPDeletion(evidenceStoreKeys) {
    evidenceStoreKeys.forEach(async (website) => {
      let a = await evidenceIDB.get(website);
      if (a == undefined) {
        return;
      } // shouldn't happen but just in case
      for (const [perm, typeLevel] of Object.entries(a)) {
        for (const [type, evUrls] of Object.entries(typeLevel)) {
          for (const [evUrl, evidence] of Object.entries(evUrls)) {
            if (
              evidence.typ in ["region", "ipAddress", "city", "zipCode"] &&
              !evidence.watchlist
            ) {
              delete a[perm][type][evUrl];
            }
          }
          if (Object.keys(a[perm][type]).length == 0) {
            delete a[perm][type];
          }
        }
        if (Object.keys(a[perm]).length == 0) {
          delete a[perm];
        }
      }
      await evidenceIDB.set(website, a);
    });
  }
  runRegIPDeletion(evKeys);
}

/**
 * getIPInfo takes the input retJson, deletes the old evidence, and returns the new data
 *
 * @param {Object<string,any>} retJson
 * @returns {Promise<Object<string,Object<string,any>>>}
 */
export async function getIpInfo(retJson) {
  await deleteFromLocation();
  var curr = {
    ip: { keyword: buildIpRegex(retJson.ip), watchlistHash: "" },
    locationData: {
      city: [{ keyword: retJson.city, watchlistHash: "" }],
      state: [
        { keyword: buildGeneralRegex(retJson.region), watchlistHash: "" },
      ],
      zipCode: [{ keyword: buildZipRegex(retJson.postal), watchlistHash: "" }],
    },
  };
  return curr;
}
