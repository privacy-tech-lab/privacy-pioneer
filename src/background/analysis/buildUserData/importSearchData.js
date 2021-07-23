/*
importSearchData.js
================================================================================
- importSearchData.js is the file that handles all the get functions to create
both the URL and the keyword list for words and URLs to look for in the
network requests
*/
import { getLocationData, filterGeocodeResponse } from "./getLocationData.js"
import { buildPhone, getState } from '../buildUserData/structuredRoutines.js'
import { watchlistKeyval } from '../../../libs/indexed-db/index.js'
import { typeEnum, permissionEnum } from "../classModels.js"
import {setEmail, digestMessage, hexToBase64} from '../requestAnalysis/encodedEmail.js';

// import keywords, services JSONs
const keywords = require("../../../assets/keywords.json");
const services = require("../../../assets/services.json");

/**
 * Used to build all the data we search for in our analysis. This includes data in the watchlist DB and the JSON lists.
 * 
 * Defined in importSearchData.js
 * 
 * Used in background.js
 *
 * @returns {Promise<Array>} [locCoords, networkKeywords, services]
 *
 * locCoords: Length 2 array of [lat, lng]
 *
 * networkKeywods: Dictionary with permissionEnum outer keys and typeEnum inner keys. Values are stored as arrays
 *
 * services: Object with data from the JSON files in assets
 */
export async function importData() {
    var networkKeywords = {}
    // watchlist == data entered by the user in our extension
    // ex phone numbers, emails, etc
    networkKeywords[permissionEnum.watchlist] = {}

    // first let's build up the location info
    var locCoords = await getLocationData();

    // get formatted data from the watchlist store
    // at bottom of file
    let user_store_dict = await getWatchlistDict();

    // format every phone stored
    var userPhone
    if ( typeEnum.phoneNumber in user_store_dict) {
        userPhone = []
        let phone_arr = user_store_dict[typeEnum.phoneNumber]
        phone_arr.forEach( phone => {
            // creates an array of possible re-configurations for each number
            let format_arr = buildPhone(phone)
            format_arr.forEach( format => {
                userPhone.push(format)
            })
        })
    }

    // if we have a phone we put it in the network keywords dict
    if ( typeof userPhone !== 'undefined' ) {
        networkKeywords[permissionEnum.watchlist][typeEnum.phoneNumber] = userPhone
    }

    // build location Elements
    var locElems = {}

    if (typeEnum.zipCode in user_store_dict) {
        const userZip = user_store_dict[typeEnum.zipCode]
        locElems[typeEnum.zipCode] = userZip
        var userState = []

        userZip.forEach( zip => {
            let abrev, state;
            [abrev, state] = getState(zip)
            if (typeof state !== 'undefined') { userState.push(state) }
        } )
        if ( userState === undefined || userState.length == 0 ) {
            // invalid zip input
        }
        else { locElems[typeEnum.state] = userState }
    }

    if (typeEnum.city in user_store_dict) {
        const userCity = user_store_dict[typeEnum.city]
        locElems[typeEnum.city] = userCity
    }

    if (typeEnum.address in user_store_dict) {
        const userAddress = user_store_dict[typeEnum.address]
        locElems[typeEnum.address] = userAddress
    }

    networkKeywords[permissionEnum.location] = locElems

    // if the user entered an email/s, add it to network keywords (formated as arr)
    if (typeEnum.emailAddress in user_store_dict) {
        networkKeywords[permissionEnum.watchlist][typeEnum.emailAddress] = user_store_dict[typeEnum.emailAddress]
        var encodedEmails = {}
        user_store_dict[typeEnum.emailAddress].forEach(async (email) => {
            const digestHex = await digestMessage(setEmail(email));
            const base64Encoded = hexToBase64(digestHex);
            const urlBase64Encoded = encodeURIComponent(base64Encoded);
            encodedEmails[email] = [base64Encoded, urlBase64Encoded]
        })
        networkKeywords[permissionEnum.watchlist][typeEnum.encodedEmail] = encodedEmails
    }

    // if we have user keywords, we add them to the network keywords (formated as arr)
    if (typeEnum.userKeyword in user_store_dict) {
        networkKeywords[permissionEnum.watchlist][typeEnum.userKeyword] = user_store_dict[typeEnum.userKeyword]
    }

    if (typeEnum.ipAddress in user_store_dict) {
        networkKeywords[permissionEnum.watchlist][typeEnum.ipAddress] = user_store_dict[typeEnum.ipAddress]
    }

    // build tracking info
    networkKeywords[permissionEnum.tracking] = {}
    networkKeywords[permissionEnum.tracking][typeEnum.trackingPixel] = keywords["PIXEL"]["URLs"]

    // build fingerprinting info. Adding fingerprinting library keywords,
    // JSON list methods
    networkKeywords[permissionEnum.tracking][typeEnum.fingerprinting] = keywords["FINGERPRINT"]

    // returns [location we obtained from google maps API, {phone #s, emails,
    // location elements entered by the user, fingerprinting keywords}, websites
    // that have identification objectives as services]
    return [locCoords, networkKeywords, services]
}



/**
 * this function takes a location object that is created when a user puts their street-address in the multi-line input and
 * updates the dictionary being built in the getWatchlistDict() function. It ignores the state entry
 * because we will take this from the zip.
 * @param {object} locObj The object containing the location elements of the user
 * @param {Dict<permissionEnum<typeEnum>>} user_dict The dictionary being built by getWatchlistDict()
 * @returns {void} Nothing. Updates the user_dict paramter
 */
function parseLocationObject(locObj, user_dict) {

    const locElems = new Set([typeEnum.address, typeEnum.city, typeEnum.zipCode])

    for ( let [t, val] of Object.entries(locObj) ) {
        if(locElems.has(t)) {
            let ktype = t
            let keyword = val
            if (t in user_dict) {
                let updated = user_dict[ktype].concat([keyword])
                user_dict[ktype] = updated
            }
            else { user_dict[ktype] = [keyword] }
        }
    }
}

/**
 * Iterates through all elements in the watchlistKeyval and returns a dictionary
 * @returns {Promise<Dict<permissionEnum<typeEnum>>}  A dictionary with first key level permission and second key level type. All values are stored as Arrays
 */
async function getWatchlistDict() {

    var user_store_dict = {}

    // iterate through the stored keywords in the watchlist store and add them to
    // a dict that maps keywordtype -> array of keywords for that type
    let keyarr = await watchlistKeyval.keys()
    for (let key of keyarr) {
        let ktype, keyword
        // get the keyword associated with the key
        let keywordObject = await watchlistKeyval.get(key)
        for (let [t, val] of Object.entries(keywordObject) ) {
            // we have either a type of key or an actual key
            // the multi-line input gets parsed with its own function
            if (t == permissionEnum.location ) { parseLocationObject(val, user_store_dict) }
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
