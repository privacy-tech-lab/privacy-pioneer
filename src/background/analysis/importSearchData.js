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
    // personalData == data entered by the user in our extension
    // ex phone numbers, emails, etc
    networkKeywords[permissionEnum.personalData] = {}

    // first let's build up the location info
    var locCoords = await getLocationData();

    // get formatted data from the watchlist store
    // at bottom of file
    let user_store_dict = await getWatchlistDict()

    // format every phone stored
    var userPhone
    if ( typeEnum.phone in user_store_dict) {
        userPhone = []
        let phone_arr = user_store_dict[typeEnum.phone]
        phone_arr.forEach( phone => {
            // creates an array of possible re-configurations for each number
            let format_arr = buildPhone(phone)
            format_arr.forEach( format => {
                userPhone.push(format)
            })
        })
    }

    // if we have a phone we put it in the network keywords dict
    if (typeof userPhone !== 'undefined') { 
        networkKeywords[permissionEnum.personalData][typeEnum.phone] = userPhone
    }

    var locElems = {}

    if (typeEnum.zipCode in user_store_dict) {
        const userZip = user_store_dict[typeEnum.zipCode][0]
        locElems[typeEnum.zipCode] = userZip
        let userStateAbrev, userState;
        [userStateAbrev, userState] = getState(userZip)
        if (typeof userState !== 'undefined') { locElems[typeEnum.state] = userState }
    }

    if (typeEnum.city in user_store_dict) {
        const userCity = user_store_dict[typeEnum.city][0]
        locElems[typeEnum.city] = userCity
    }

    if (typeEnum.streetAddress in user_store_dict) {
        const userAddress = user_store_dict[typeEnum.streetAddress][0]
        locElems[typeEnum.streetAddress] = userAddress
    }

    networkKeywords[permissionEnum.location] = locElems

    /* I don't think this should be part of our tool's functionality... We can discuss next meeting.
    // ssn routine
    const exampleSsn = '163125213'
    const SsnRegex = buildSsnRegex(exampleSsn)
    */

    // if we have user keywords, we add them to the network keywords (formated as arr)
    // we check for general because this is the title they get in the db.
    if (typeEnum.general in user_store_dict) {
        networkKeywords[permissionEnum.personalData][typeEnum.userKeyword] = user_store_dict[typeEnum.general]
    }

    // build fingerprinting info. Adding fingerprinting library keywords, 
    // JSON list methods 
    networkKeywords[permissionEnum.fingerprinting] = {}
    networkKeywords[permissionEnum.fingerprinting][typeEnum.fingerprintLib] = keywords["FINGERPRINT"]["fpLibraryList"]
    networkKeywords[permissionEnum.fingerprinting][typeEnum.fingerprintJSON] =  keywords["FINGERPRINT"]["fpJSONList"]

    // returns [location we obtained from google maps API, {phone #s, emails, 
    // location elements entered by the user, fingerprinting keywords}, websites 
    // that have identification objectives as services]

    console.log(networkKeywords)
    return [locCoords, networkKeywords, services]
}

async function getWatchlistDict() {

    var user_store_dict = {}

    // iterate through the stored keywords in the watchlist store and add them to 
    // a dict that maps keywordtype -> array of keywords for that type
    let keyarr = await WatchlistKeyval.keys()
    for (let key of keyarr) {
        let ktype, keyword
        // get the keyword associated with the key
        let keywordObject = await WatchlistKeyval.get(key)
        for (let [t, val] of Object.entries(keywordObject) ) {
            // we have either a type of key or an actual key
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
    // returns array of user inputs (as keywords) per type of input
    return user_store_dict
}
