/*
importSearchData.js
================================================================================
- importSearchData.js is the file that handles all the get functions to create
both the URL and the keyword list for words and URLs to look for in the
network requests
*/
import { getLocationData, filterGeocodeResponse } from "./getLocationData.js"
import { buildPhone, getState } from '../buildUserData/structuredRoutines.js'
import { typeEnum, permissionEnum } from "../classModels.js"
import {setEmail, digestMessage, hexToBase64} from '../requestAnalysis/encodedEmail.js';
import { getWatchlistDict, hashUserDictValues, createKeywordObj } from "./structureUserData.js";
import { watchlistHashGen } from "../utility/util.js";

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
async function importData() {
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
            const origHash = watchlistHashGen(phone)
            // creates an array of possible re-configurations for each number
            let format_arr = buildPhone(phone)
            format_arr.forEach( format => {
                userPhone.push(createKeywordObj(format, typeEnum.phoneNumber, origHash))
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

    if (typeEnum.streetAddress in user_store_dict) {
        const userAddress = user_store_dict[typeEnum.streetAddress]
        locElems[typeEnum.streetAddress] = userAddress
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
            const origHash = watchlistHashGen(typeEnum.emailAddress, email)
            const base64EncodedObj = createKeywordObj(base64Encoded, typeEnum.emailAddress, origHash);
            const urlBase64EncodedObj = createKeywordObj(urlBase64Encoded, typeEnum.emailAddress, origHash);
            encodedEmails[email] = [base64EncodedObj, urlBase64EncodedObj]
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

    networkKeywords = hashUserDictValues(networkKeywords);

    console.log(networkKeywords);


    // returns [location we obtained from google maps API, {phone #s, emails,
    // location elements entered by the user, fingerprinting keywords}, websites
    // that have identification objectives as services]
    return [locCoords, networkKeywords, services]
}


export { importData }