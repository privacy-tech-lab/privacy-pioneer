/*
requestModel.js
================================================================================
- requestModel.js defines a structure of a network request
*/

import { openDB } from 'idb';

const dbPromise = openDB('keyval-store', 2, {
  upgrade(db) {
    db.createObjectStore('firstPartyEvidence');
    db.createObjectStore('thirdPartyEvidence');
  },
});

/**
 * The evidenceKeyval has two object stores. One for first party evidence and another for third party evidence.
 * Within each store, evidence is stored with the rootUrl as the key.
 */
export const evidenceKeyval = {
  async get(key, fP) {
    const store = fP == true ? 'firstPartyEvidence' : 'thirdPartyEvidence';
    return (await dbPromise).get(store, key);
  },
  async set(key, val, fP) {
    const store = fP == true ? 'firstPartyEvidence' : 'thirdPartyEvidence';
    return (await dbPromise).put(store, val, key);
  },
  async del(key, fP) {
    const store = fP == true ? 'firstPartyEvidence' : 'thirdPartyEvidence';
    return (await dbPromise).delete(store, key);
  },
  async clear(fP) {
    const store = fP == true ? 'firstPartyEvidence' : 'thirdPartyEvidence';
    return (await dbPromise).clear(store);
  },
  async keys(fP) {
    const store = fP == true ? 'firstPartyEvidence' : 'thirdPartyEvidence';
    return (await dbPromise).getAllKeys(store);
  },
}

