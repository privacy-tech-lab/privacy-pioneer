import { evidenceKeyval as evidenceIDB } from '../interactDB/openDB.js';
import { buildIpRegex, buildZipRegex, buildGeneralRegex } from './structuredRoutines.js'

async function deleteFromLocation ( ) {
    let evKeys = await evidenceIDB.keys()

    /**
     * Deletes evidence if watchlistHash of the evidence is the same as the id we are deleting from the watchlist
     * @param {Object} evidenceStoreKeys All keys from the related store, taken from the above lines
     */
    function runRegIPDeletion(evidenceStoreKeys) {
        evidenceStoreKeys.forEach(async (website) => {
        let a = await evidenceIDB.get(website)
        if (a == undefined) {
            return
        } // shouldn't happen but just in case
        for (const [perm, typeLevel] of Object.entries(a)) {
            for (const [type, evUrls] of Object.entries(typeLevel)) {
                for (const [evUrl, evidence] of Object.entries(evUrls)) {
                    if ((evidence.typ in ['state', 'ipAddress', 'city', 'zipCode']) && !evidence.watchlist) {
                    delete a[perm][type][evUrl]
                    }
                }
                if (Object.keys(a[perm][type]).length == 0) {
                    delete a[perm][type]
                }
            }
            if (Object.keys(a[perm]).length == 0) {
                delete a[perm]
            }
        }
        await evidenceIDB.set(website, a)
        })
    }
    runRegIPDeletion(evKeys)
}

export const getIpInfo = async (retJson) => {
    await deleteFromLocation()
    var curr = {
        'ip': {'keyword': buildIpRegex(retJson.ip), 'watchlistHash': buildIpRegex(retJson.ip)},
        'locationData': {
            'city': [{'keyword': retJson.city, 'watchlistHash': retJson.city}],
            'state': [{'keyword': buildGeneralRegex(retJson.region), 'watchlistHash': buildGeneralRegex(retJson.region)}],
            'zipCode': [{'keyword': buildZipRegex(retJson.postal), 'watchlistHash': buildZipRegex(retJson.postal)}]
        }
    };
    return curr
  }