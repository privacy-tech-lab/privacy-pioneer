import { createBlob } from "./createBlob.js"

function blobToURL(blob){

    const dataURL = URL.createObjectURL(blob)
    return dataURL
}

function initiateDownload() {
    
    // URL to reference all user data
    const downloadURL = blobToURL(createBlob());

    var downloading = browser.downloads.download({
        url: downloadURL,
        filename: 'integrated_privacy_analysis_data'

    })

}