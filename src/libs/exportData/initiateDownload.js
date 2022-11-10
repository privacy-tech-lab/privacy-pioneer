/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { createAnalyticsBlob, createBlob } from "./createBlob.js";
import {
  exportTypeEnum,
  timeRangeEnum,
} from "../../background/analysis/classModels.js";

/**
 * Enodes a blob into a URL
 * @param {Blob} blob
 * @returns {URL} A URL encoding the blob
 */
function blobToURL(blob) {
  // creates a URL with the data from the blob passed
  const dataURL = URL.createObjectURL(blob);

  return dataURL;
}

/**
 * Entry point for downloading the user's stored data.
 * User does not choose the name for the file (so we can properly revoke the Object URL later)
 * Defaults to TSV.
 *
 * The CSV file is much smaller: it only includes the part of snippets that we have indexes for (like in the popup)
 *
 * The JSON file dumps everything we have
 * @param {string} exportDataType From exportTypeEnum: The type of data the user wants their data to be formatted. TSV or JSON.
 * @param {number} timeRange From timeRangeEnum. Time range for evidence export
 * @returns {void} Nothing. Initiates the download.
 */
async function initiateDownload(
  exportDataType = exportTypeEnum.TSV,
  timeRange = timeRangeEnum.allTime
) {
  const timeStampLowerBound = Date.now() - timeRange;

  // create the blob to be converted to a URL
  const dataBlob = await createBlob(exportDataType, timeStampLowerBound);

  // this URL encodes the data in the blob to be downloaded
  const downloadURL = blobToURL(dataBlob);

  var downloading = browser.downloads.download({
    url: downloadURL,
    filename: `privacy_pioneer_data.${exportDataType}`,
  });
}

async function initiateAnalyticsDownload(
  exportDataType = exportTypeEnum.JSON,
  timeRange = timeRangeEnum.allTime
) {
  const timeStampLowerBound = Date.now() - timeRange

  // create the blob to be converted to a URL
  const dataBlob = await createAnalyticsBlob()

  // this URL encodes the data in the blob to be downloaded
  const downloadURL = blobToURL(dataBlob)

  var downloading = browser.downloads.download({
    url: downloadURL,
    filename: `privacy_pioneer_analytics.${exportDataType}`,
  })
}

export { initiateDownload, initiateAnalyticsDownload };
