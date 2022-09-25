/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

/*
requestModel.js
================================================================================
- requestModel.js defines a structure of a network request
*/

import { openDB } from "idb";

const storeKey = "firstPartyEvidence";

/**
 * @type {Promise}
 * opens up the DB. Used by the evidenceKeyval constant to mutate the DB.
 */
const dbPromise = openDB("keyval-store", 1, {
  upgrade(db) {
    db.createObjectStore(storeKey);
  },
});

/**
 * The evidenceKeyval has two object stores. One for first party evidence and another for third party evidence.
 * Within each store, evidence is stored with the rootUrl as the key.
 *
 * Defined in openDB.js
 *
 * Used in backend (classModels.js, addEvidence.js, createBlob.js) and frontend (libs/indexed-db/index.js)
 *
 * @class idbKeyval
 * @method get param(key) returns a promise with the value at a given key. undefined if no such key exists.
 * @method set param(key, val) sets a value at a key
 * @method del param(key) deletes a key value pair
 * @method clear param() empties the evidence store
 * @method keys param() returns all the keys in the evidence store
 * @method values param() returns all the all vaues in the evidence store
 */
export const evidenceKeyval = {
  async get(key) {
    return (await dbPromise).get(storeKey, key);
  },
  async set(key, val) {
    return (await dbPromise).put(storeKey, val, key);
  },
  async del(key) {
    return (await dbPromise).delete(storeKey, key);
  },
  async clear() {
    return (await dbPromise).clear(storeKey);
  },
  async keys() {
    return (await dbPromise).getAllKeys(storeKey);
  },
};
