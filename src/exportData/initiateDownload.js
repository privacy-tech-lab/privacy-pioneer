import { createBlob } from "./createBlob.js"
import { exportTypeEnum } from "../background/analysis/classModels.js"

/**
 * Enodes a blob into a URL
 * @param {Blob} blob 
 * @returns {URL} A URL encoding the blob
 */
function blobToURL(blob){

    // creates a URL with the data from the blob passed
    const dataURL = URL.createObjectURL(blob)
    console.log(dataURL)

    return dataURL
}

/**
 * Entry point for downloading the user's stored data.
 * The user will get to select the name of the file. 
 * Defaults to CSV
 * 
 * The CSV file is much smaller: it only includes the part of snippets that we have indexes for (like in the popup)
 * 
 * The JSON file dumps everything we have
 * @param {string} exportDataType From exportTypeEnum: The type of data the user wants their data to be formatted
 */
async function initiateDownload(exportDataType = exportTypeEnum.TSV) {
    
    // create the blob to be converted to a URL
    const dataBlob = await createBlob(exportDataType);
    
    // this URL encodes the data in the blob to be downloaded
    const downloadURL = blobToURL(dataBlob);

    var downloading = browser.downloads.download({
        url: downloadURL,
        filename: `integrated_privacy_analysis_data.${exportDataType}`,
        saveAs: true,
    });
}

export { initiateDownload }