/*
requestModel.js
================================================================================
- requestModel.js defines a structure of a network request
*/

import { openDB } from "idb";

/**
 * @type {Promise}
 * opens up the DB. Used by the evidenceKeyval constant to mutate the DB.
 */
const dbPromise = openDB("keyval-store", 2, {
  upgrade(db) {
    db.createObjectStore("firstPartyEvidence");
    db.createObjectStore("thirdPartyEvidence");
  },
});

/**
 * The evidenceKeyval has two object stores. One for first party evidence and another for third party evidence.
 * Within each store, evidence is stored with the rootUrl as the key.
 * @class idbKeyval
 * @method get param(key, store) returns a promise with the value at a given key. undefined if no such key exists.
 * @method set param(key, val, store) sets a value at a key
 * @method del param(key, store) deletes a key value pair
 * @method clear param(store) empties the given object store
 * @method keys param(store) returns all the keys in the given object store
 * @method values param(store) returns all the all vaues in the given object store
 */
export const evidenceKeyval = {
  async get(key, store) {
    return (await dbPromise).get(store, key);
  },
  async set(key, val, store) {
    return (await dbPromise).put(store, val, key);
  },
  async del(key, store) {
    return (await dbPromise).delete(store, key);
  },
  async clear(store) {
    return (await dbPromise).clear(store);
  },
  async keys(store) {
    return (await dbPromise).getAllKeys(store);
  },
};
