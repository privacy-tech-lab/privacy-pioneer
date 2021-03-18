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

export async function importData() {
    var networkKeywords = {}

    // first let's build up the location info
    var locCoords = await getLocationData();

    // for now setting placeholder of our location. Eventually this will
    // be swapped for the users custom input
    var locElems = ["Middletown", "Connecticut", "Lawn Ave", "06457"]

    networkKeywords["location"] = locElems

    // now let's build up fingerprinting info

    return [locCoords, networkKeywords, services]
}
