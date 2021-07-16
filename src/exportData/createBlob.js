import { storeEnum } from "../background/analysis/classModels";
import { evidenceKeyval } from "../background/analysis/interactDB/openDB";

/**
 * Gets all evidence and returns an array of Evidence objects. No params. 
 * @returns {Array<Evidence>} An array of all the evidence objects in the IndexedDB
 */
function buildEvidenceAsArray() {

    var evidenceArr = []

    // update the arr we will turn into a blob
    evidenceArr = await walkStoreAndBuildArr(storeEnum.firstParty, evidenceArr)
    evidenceArr = await walkStoreAndBuildArr(storeEnum.thirdParty, evidenceArr)

    return evidenceArr
}

/**
 * Walks a store and builds an Array
 * 
 * @param {string} store The store we are walking (first or third party)
 * @param {Array} evidenceObjectArr The array we are building
 * @returns {Promise<Array<Evidence>>} 
 */
async function walkStoreAndBuildArr(store, evidenceObjectArr) {

    const allKeys = await evidenceKeyval.keys(store)

    for (const key of allKeys) {
        const evidenceDict = await evidenceKeyval.get(key);
        for (const [permLevel, typeLevel] of Object.entries(evidenceDict)) {
            for (const [reqUrl, evidenceObject] of Object.entries(typeLevel)){
                evidenceObjectArr.push(evidenceObject)
            }
        }
    }

    return evidenceObjectArr
}


/**
 * Creates the blob to be downloaded by the user
 * @returns {Blob}
 */
function createBlob() {

    const dataArr = buildEvidenceAsArray()
    return new Blob(dataArr)
}


export { createBlob }