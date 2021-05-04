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
import { WatchlistKeyval } from "../../libs/indexed-db/index.js"
import { typeEnum, permissionEnum } from "./classModels.js"


export async function importData() {
    var networkKeywords = {}
    networkKeywords[permissionEnum.personalData] = {}

    // first let's build up the location info
    var locCoords = await getLocationData();

    // get formatted data from the watchlist store
    let user_store_dict = await getWatchlistDict()

    // format every phone stored
    var userPhone
    if ( typeEnum.phone in user_store_dict) {
        userPhone = []
        let phone_arr = user_store_dict[typeEnum.phone]
        phone_arr.forEach( phone => {
            let format_arr = buildPhone(phone)
            format_arr.forEach( format => {
                userPhone.push(format)
            })
        })
    }


    const exampleZip = "06459"
    const exampleCity = "Middletown"
    const exampleAddress = "Lawn Ave"
    let userStateAbrev, userState;
    [userStateAbrev, userState] = getState(exampleZip)

    // ssn routine
    const exampleSsn = '163125213'
    const SsnRegex = buildSsnRegex(exampleSsn)

    // for now setting placeholder of our location. Eventually this will
    // be swapped for the users custom input
    var locElems = {}
    locElems[typeEnum.zipCode] = exampleZip
    locElems[typeEnum.city] = exampleCity
    locElems[typeEnum.streetAddress] = exampleAddress
    if (typeof userState !== 'undefined') { locElems[typeEnum.state] = userState }

    networkKeywords[permissionEnum.location] = locElems
    
    // if we have a phone we put it in the network keywords dict
    if (typeof userPhone !== 'undefined') { 
        networkKeywords[permissionEnum.personalData][typeEnum.phone] = userPhone
    }

    if (typeEnum.email in user_store_dict) {
        networkKeywords[permissionEnum.personalData][typeEnum.email] = user_store_dict[typeEnum.email]
    }

    // now let's build up fingerprinting info
    networkKeywords[permissionEnum.fingerprinting] = {}
    networkKeywords[permissionEnum.fingerprinting][typeEnum.fingerprintLib] = keywords["FINGERPRINT"]["fpLibraryList"]
    networkKeywords[permissionEnum.fingerprinting][typeEnum.fingerprintJSON] =  keywords["FINGERPRINT"]["fpJSONList"]

    return [locCoords, networkKeywords, services]
}

async function getWatchlistDict() {

    var user_store_dict = {}

    // iterate through the stored keywords in the watchlist store and add them to a dict that maps
    // keywordtype -> array of keywords for that type
    let keyarr = await WatchlistKeyval.keys()
    for (let key of keyarr) {
        let ktype, keyword
        let keywordObject = await WatchlistKeyval.get(key)
        for (let [t, val] of Object.entries(keywordObject) ) {
            if (t == 'type') { ktype = val }
            if (t == 'keyword') { keyword = val }
       }
       if (typeof ktype !== 'undefined' && typeof keyword !== 'undefined') {
           if (ktype in user_store_dict) {
            let updated = user_store_dict[ktype].concat([keyword]) //the concat is fine for now, I'm not sure why push isn't working
            user_store_dict[ktype] = updated
           }
           else { user_store_dict[ktype] = [keyword] }
        }
    }
    return user_store_dict
}
