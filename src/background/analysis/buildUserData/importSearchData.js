/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

/*
importSearchData.js
================================================================================
- importSearchData.js is the file that handles all the get functions to create
both the URL and the keyword list for words and URLs to look for in the
network requests
*/
import { getLocationData, filterGeocodeResponse } from "./getLocationData.js"
import { buildPhone, getState, buildIpRegex, buildZipRegex, stateObj } from './structuredRoutines.js'
import { typeEnum, permissionEnum, settingsModelsEnum, KeywordObject } from "../classModels.js"
import {setEmail, digestMessage, hexToBase64} from '../requestAnalysis/encodedEmail.js';
import { getWatchlistDict, hashUserDictValues, createKeywordObj } from "./structureUserData.js";
import { watchlistHashGen } from "../utility/util.js";
import { settingsKeyval } from "../../../libs/indexed-db/openDB.js";
import { evidenceKeyval as evidenceIDB } from '../interactDB/openDB.js';

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
    var locCoords = await getLocationData()

    // get formatted data from the watchlist store
    // at bottom of file
    let user_store_dict = await getWatchlistDict();

    // format every phone stored
    var userPhone
    if ( typeEnum.phoneNumber in user_store_dict) {
        userPhone = []
        let phone_arr = user_store_dict[typeEnum.phoneNumber]
        phone_arr.forEach( phone => {
            const origHash = watchlistHashGen(typeEnum.phoneNumber, phone)
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
        var userStateArr = []
        var userZipArr = []
        userZip.forEach( zip => {
            const locHash = zip[1]
            const zipRegex = buildZipRegex(zip[0])
            const zipObj = new KeywordObject({keyword: zipRegex, keywordHash: locHash})
            userZipArr.push(zipObj)
            let abrev, state;
            
            // try to get the state from the zip
            const stArr = getState(zip[0])
            if (typeof(stArr) !== 'undefined') {
                [abrev, state] = stArr
                userStateArr.push(new KeywordObject({keyword: state, keywordHash: locHash})) 
            }
        } )
        if ( userStateArr === undefined || userStateArr.length == 0 ) {
            // invalid zip input
        }
        else { locElems[typeEnum.state] = userStateArr }

        locElems[typeEnum.zipCode] = userZipArr
    }

    if (typeEnum.state in user_store_dict) {
        // init the arr if we didn't grab it from the zip above
        if (!(typeEnum.state in locElems)) {
            locElems[typeEnum.state] = []
        }

        const userState = user_store_dict[typeEnum.state]
        userState.forEach( state => {
            for (const [abrev, regex] of Object.entries(stateObj)) {
                if (abrev == state[0] && !locElems[typeEnum.state].includes(abrev)) {
                    locElems[typeEnum.state].push(new KeywordObject({keyword: regex, keywordHash: state[1]}))
                }
            }
        })
    }

    if (typeEnum.city in user_store_dict) {
        var cityArr = []
        const userCity = user_store_dict[typeEnum.city]
        userCity.forEach( city => {
            cityArr.push( new KeywordObject({keyword: city[0], keywordHash: city[1]}) )
        } )
        locElems[typeEnum.city] = cityArr
    }

    if (typeEnum.streetAddress in user_store_dict) {
        var addrArr = []
        const userAddress = user_store_dict[typeEnum.streetAddress]
        userAddress.forEach( addr => {
            addrArr.push( new KeywordObject({keyword: addr[0], keywordHash: addr[1]}) )
        })
        locElems[typeEnum.streetAddress] = addrArr
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
        var ipArr = []
        for ( const ip of user_store_dict[typeEnum.ipAddress] ) {
            const origHash = watchlistHashGen(typeEnum.ipAddress, ip)
            const ipRegex = buildIpRegex(ip)
            const ipObj = createKeywordObj(ipRegex, typeEnum.ipAddress, origHash)
            ipArr.push(ipObj)
        }
        networkKeywords[permissionEnum.watchlist][typeEnum.ipAddress] = ipArr
    }

    // build tracking info
    networkKeywords[permissionEnum.tracking] = {}
    networkKeywords[permissionEnum.tracking][typeEnum.trackingPixel] = keywords["PIXEL"]["URLs"]

    // build fingerprinting info. Adding fingerprinting library keywords,
    // JSON list methods
    networkKeywords[permissionEnum.tracking][typeEnum.fingerprinting] = keywords["FINGERPRINT"]["fpLibraryList"]

    networkKeywords = hashUserDictValues(networkKeywords);

    const fullSnippet = await settingsKeyval.get(settingsModelsEnum.fullSnippet)
    const optimizePerformance = await settingsKeyval.get(settingsModelsEnum.optimizePerformance)

    async function deleteFromLocation ( reg ) {
        let evKeys = await evidenceIDB.keys()

        function runRegionChange(reg) {
            
        }

        const id = runRegionChange(reg)

        /**
         * Deletes evidence if watchlistHash of the evidence is the same as the id we are deleting from the watchlist
         * @param {Object} evidenceStoreKeys All keys from the related store, taken from the above lines
         */
        function runDeletion(evidenceStoreKeys) {
            console.log(evidenceStoreKeys)
            evidenceStoreKeys.forEach(async (website) => {
            let a = await evidenceIDB.get(website)
            console.log(a)
            if (a == undefined) {
                return
            } // shouldn't happen but just in case
            for (const [perm, typeLevel] of Object.entries(a)) {
                for (const [type, evUrls] of Object.entries(typeLevel)) {
                for (const [evUrl, evidence] of Object.entries(evUrls)) {
                    if (id == evidence.snippet.substring(evidence.index[0],evidence.index[1])) {
                    delete a[perm][type][evUrl]
                    }
                }
                if (Object.keys(a[perm][type]).length == 0) {
                    delete a[perm][type]
                }
                }
            }
            console.log(a)
            await evidenceIDB.set(website, a)
            })
        }
        runDeletion(evKeys)
    }

    var lastIP = '';
    var lastRegion = '';

    const getReg = async (retJson) => {
        lastIP = retJson.query
        await deleteFromLocation(lastRegion)
        lastRegion = retJson.regionName
        return retJson.regionName
      }

    var currRegion;
    if (await settingsKeyval.get(settingsModelsEnum.ipLayer)) {
        const ret = await fetch("http://ip-api.com/json/");
        const retJson = await ret.json()
        if (retJson.query != lastIP) {
            currRegion = await getReg(retJson)
            console.log('getReg')
        }
    }



    // returns [location we obtained from google maps API, {phone #s, emails,
    // location elements entered by the user, fingerprinting keywords}, websites
    // that have identification objectives as services, current state if enabled]
    return [locCoords, networkKeywords, services, fullSnippet, optimizePerformance, currRegion]
}


export { importData }