/*
importSearchData.js
================================================================================
- importSearchData.js is the file that handles all the get functions to create
both the URL and the keyword list for words and URLs to look for in the
network requests
*/
import { getLocationData, filterGeocodeResponse } from "./getLocationData.js"
import { buildPhone, getState, buildSsnRegex } from "./structuredRoutines.js"
import { WatchlistKeyval } from "../../libs/indexed-db/index.js"
import { typeEnum, permissionEnum } from "./classModels.js"

// import keywords, services JSONs
const keywords = require("../../assets/keywords.json");
const services = require("../../assets/services.json");


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
    // if the user entered an email/s, add it to network keywords (formated as arr)
    if (typeEnum.email in user_store_dict) {
        networkKeywords[permissionEnum.personalData][typeEnum.email] = user_store_dict[typeEnum.email]
    }

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
