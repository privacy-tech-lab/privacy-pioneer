import { Request, typeEnum, permissionEnum, optOutEnum, privacyFrameworkEnum, Evidence } from "./classModels.js"
import { addToEvidenceList } from "./addEvidence.js"
import { regexSpecialChar, escapeRegExp } from "./regexFunctions.js"
import { getHostname } from "./util.js"


/**
 * Looks for Google rdp and us_privacy string and returns dictionary with what it found.
 * 
 * @param {Request} request HTTP Request 
 * @returns {Dict} dictionary mapping privacy framework to result for that framework (optOutEnum)
 */
async function tagOptOuts(request) {
    const reqUrl = request.details["url"]
    let rdpResult = rdpScan(request)
    let usPrivacyResult = usPrivacyScan(request)
    let scanResults = {}
    scanResults[privacyFrameworkEnum.googleRDP] = rdpResult
    scanResults[privacyFrameworkEnum.usPrivacy] = usPrivacyResult

    return scanResults
}

function rdpScan(request) {

    /**
     * From Google's documentation:
     * If you're using Tagless Request, you can mark an ad request 
     * as restricted data processing by adding the rdp=[int] 
     * parameter directly to the tag request URL. We recommend you 
     * specify the parameter early in the tag to avoid any risk of truncation.
     * Specify rdp=1 to mark the ad request as restricted data processing. 
     * Omission of the parameter defaults to disabling restricted data processing and allowing personalized ads. 
     * @param {string} reqUrl The request url
     * @returns {string|undefined} 
     */
    function urlParamScan(reqUrl) {
        let checkIndex = reqUrl.search(/rdp=./)
        // neither in or out found
        if ( checkIndex == -1 ) { return undefined }
        // the checkIndex + 4 gives us either a 1 or a 0, indicating in or out
        return reqUrl.charAt(checkIndex + 4) == 1 ? optOutEnum.affirmativeOut : optOutEnum.affirmativeIn
    }

    let paramScan = urlParamScan(request.details["url"])

    if ( paramScan != undefined ) { return paramScan }
    return optOutEnum.noSignalFound
}


function usPrivacyScan(request) {

    function urlParamScan(reqUrl) {
        let checkIndex = reqUrl.search(/us_privacy=./)
        // neither in or out found
        if ( checkIndex == -1 ) { return undefined }
        //the char after the = sign
        let settingChar = reqUrl.charAt(checkIndex + 11)
        if ( settingChar == 1 ) {return optOutEnum.affirmativeOut}
        return optOutEnum.affirmativeIn
    }

    let paramScan = urlParamScan(request.details["url"])

    if ( paramScan != undefined ) { return paramScan }
    return optOutEnum.noSignalFound
}

export { tagOptOuts }