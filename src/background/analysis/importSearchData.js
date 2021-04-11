/*
importSearchData.js
================================================================================
- importSearchData.js is the file that handles all the get functions to create
both the URL and the keyword list for words and URLs to look for in the
network requests
*/
import { keywords } from "./importJson.js"
import { services } from "./importJson.js"
import { getLocationData, filterGeocodeResponse } from "./getLocationData.js"
import { buildPhone, getState, buildSsnRegex } from "./structuredRoutines.js"

export async function importData() {
    var networkKeywords = {}

    // first let's build up the location info
    var locCoords = await getLocationData();

    // phone number routine
    const examplePhone = "9738608562";
    const userPhone = buildPhone(examplePhone);

    //zip routine
    const exampleZip = "06459"
    let userStateAbrev, userState;
    [userStateAbrev, userState] = getState(exampleZip)

    // ssn routine
    const exampleSsn = '163125213'
    const SsnRegex = buildSsnRegex(exampleSsn)

    // for now setting placeholder of our location. Eventually this will
    // be swapped for the users custom input
    var locElems = ["Middletown", "Connecticut", "Lawn Ave", "06457"]

    networkKeywords["location"] = locElems
    networkKeywords["phone"] = userPhone

    // now let's build up fingerprinting info

    return [locCoords, networkKeywords, services]
}
