import { storeEnum, exportTypeEnum } from "../background/analysis/classModels";
import { evidenceKeyval } from "../background/analysis/interactDB/openDB.js";

/**
 * Gets all evidence and returns an array of Evidence objects. No params. 
 * @returns {Promise<Array<Evidence>>} An array of all the evidence objects in the IndexedDB
 */
async function buildEvidenceAsArray() {

    var evidenceArr = []

    // update the arr with the evidences in both stores
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

    const allKeys = await evidenceKeyval.keys(store);

    // iterate through all the rootUrls we have in the store
    for (const key of allKeys) {
        const evidenceDict = await evidenceKeyval.get(key, store);
        for (const [permLevel, typeLevel] of Object.entries(evidenceDict)) {
            for (const [type, reqUrlLevel] of Object.entries(typeLevel)){
                for (const [reqUrl, evidenceObject] of Object.entries(reqUrlLevel)){
                    evidenceObjectArr.push(evidenceObject)
                }
            }
        }
    }

    return evidenceObjectArr
}

/**
 * Takes an array of Evidence and returns a JSON blob.
 * 
 * @param {Array<Evidence>} arr 
 * @returns {Blob} A JSON Blob
 */
function createJsonBlob(arr) {

    const jsonData = JSON.stringify(arr)

    return new Blob([jsonData],
        {type: "application/json"});
}

/**
 * Converts an array of Evidence Objects into a csv string.
 * Only adds snippets for Evidence with indexes, and replaces all commas with '.' 
 * (I was having trouble finding a simpler solution for escaping commas).
 * 
 * @param {Array<Evidence>} objArray 
 * @returns {string} A csv ready string
 */
function buildCsvString(objArray) {

    // initiate column titles
    var strArray = ['Timestamp,Permission,rootURL,httpSnippet,reqUrl,Type,Index,FirstParty?,Parent'];

    for (const evidenceObj of objArray) {
        let rowArr = []
        for (const [header, value] of Object.entries(evidenceObj) ) {
            if (header != 'snippet') {
                rowArr.push( String(value).replace(/,/g, ".") ) // add entry as string and escape commas as .
            }
            else {
                if (evidenceObj.index != -1) {
                    // if we have a snippet for this evidence object, we add 150 characters around the evidence to the csv
                    let start, finish
                    [start, finish] = evidenceObj.index
                    rowArr.push( value.substring(start - 150, finish + 150).replace(/,/g, ".") )
                }
                else {
                    rowArr.push('');
                }
            } 
        }
        // add a row of values
        strArray.push(rowArr.join(','));
    }
    strArray.push('NOTE: Commas have been replaced with \'.\'. Use the JSON export for the raw data (including the full HTTP requests)')

    // add all rows. separate rows.
    return strArray.join('\r');
}

function createCSV(arr) {

    const blobString = buildCsvString(arr);
    
    return new Blob([blobString],
        {type: "application/vnd.ms-excel"});
}


/**
 * Creates the blob to be downloaded by the user. Defaults to CSV because output is much smaller.
 * @param {string} blobType A string specifying what kind of blob to create
 * @returns {Promise<Blob>}
 */
async function createBlob(blobType = exportTypeEnum.CSV) {

    const dataArr = await buildEvidenceAsArray()
    
    switch (blobType) {
        case exportTypeEnum.JSON:
            return createJsonBlob(dataArr)
        case exportTypeEnum.CSV:
            return createCSV(dataArr)
        default:
            return createCSV(dataArr);
    }

}


export { createBlob }