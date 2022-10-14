/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { exportTypeEnum } from "../../background/analysis/classModels";
import { evidenceKeyval } from "../../background/analysis/interactDB/openDB.js";
import { analyticsKeyval } from "../indexed-db/openDB";
import { buildTsvString } from "./createExportString.js";

/**
 * Gets all evidence and returns an array of Evidence objects. No params.
 * @param {number} timeStampLB no evidence created before this number (date) should be exported
 * @returns {Promise<Array<Evidence>>} An array of all the evidence objects in the IndexedDB
 */
async function buildEvidenceAsArray(timeStampLB) {
  var evidenceArr = [];

  // update the arr with evidence
  evidenceArr = await walkStoreAndBuildArr(evidenceArr, timeStampLB);

  return evidenceArr;
}

/**
 * Walks a store and builds an Array
 *
 * @param {string} store The store we are walking (first or third party)
 * @param {Array} evidenceObjectArr The array we are building
 * @returns {Promise<Array<Evidence>>}
 */
async function walkStoreAndBuildArr(evidenceObjectArr, timeStampLB) {
  const allKeys = await evidenceKeyval.keys();

  // iterate through all the rootUrls we have in the store
  for (const key of allKeys) {
    const evidenceDict = await evidenceKeyval.get(key);
    for (const [permLevel, typeLevel] of Object.entries(evidenceDict)) {
      for (const [type, reqUrlLevel] of Object.entries(typeLevel)) {
        for (const [reqUrl, evidenceObject] of Object.entries(reqUrlLevel)) {
          if (evidenceObject.timestamp > timeStampLB) {
            evidenceObjectArr.push(evidenceObject);
          }
        }
      }
    }
  }

  return evidenceObjectArr;
}

/**
 * Takes an array of Evidence and returns a JSON blob.
 *
 * @param {Array<Evidence>} arr
 * @returns {Blob} A mime-type JSON Blob
 */
function createJsonBlob(arr) {
  const jsonData = JSON.stringify(arr);

  return new Blob([jsonData], { type: "application/json" });
}

/**
 * Takes an array of Evidence and returns a .tsv blob
 *
 * @param {Array<Evidence>} arr
 * @returns {Blob} A mime-type tsv Blob
 */
function createTsvBlob(arr) {
  const blobString = buildTsvString(arr);

  return new Blob([blobString], { type: "text/tab-separated-values" });
}

/**
 * Creates the blob to be downloaded by the user. Defaults to CSV because output is much smaller.
 * @param {string} blobType A string specifying what kind of blob to create
 * @param {number} timeStampLB no evidence created before this number (date) should be exported
 * @returns {Promise<Blob>}
 */
async function createBlob(blobType = exportTypeEnum.TSV, timeStampLB) {
  const dataArr = await buildEvidenceAsArray(timeStampLB);

  switch (blobType) {
    case exportTypeEnum.JSON:
      return createJsonBlob(dataArr);
    case exportTypeEnum.TSV:
      return createTsvBlob(dataArr);
    default:
      return createTsvBlob(dataArr);
  }
}

async function createAnalyticsBlob() {
  const dataArr = await analyticsKeyval.values();
  return createJsonBlob(dataArr);
}

export { createBlob, createAnalyticsBlob };
