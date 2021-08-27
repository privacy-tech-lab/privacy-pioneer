/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import { typeEnum, permissionEnum, KeywordObject } from "../classModels.js";
import { watchlistKeyval } from '../../../libs/indexed-db/openDB.js';
import { watchlistHashGen } from "../utility/util.js";


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
            if (t == permissionEnum.location ) { parseLocationObject(val, user_store_dict, keywordObject.id) }
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


/**
 * Helper function
 * this function takes a location object that is created when a user puts their street-address in the multi-line input and
 * updates the dictionary being built in the getWatchlistDict() function. It ignores the state entry
 * because we will take this from the zip.
 * @param {object} locObj The object containing the location elements of the user
 * @param {Dict<permissionEnum<typeEnum>>} user_dict The dictionary being built by getWatchlistDict()
 * @returns {void} Nothing. Updates the user_dict paramter
 */
 function parseLocationObject(locObj, user_dict, id) {

    const locElems = new Set([typeEnum.streetAddress, typeEnum.city, typeEnum.zipCode, typeEnum.state])

    for ( let [t, val] of Object.entries(locObj) ) {
        if(locElems.has(t)) {
            let ktype = t
            let keyword = val
            if (t in user_dict) {
                let updated = user_dict[ktype].concat([[keyword, id]])
                user_dict[ktype] = updated
            }
            else { user_dict[ktype] = [[keyword, id]] }
        }
    }
}

/**
 * Optionally is passed a hash.
 * Otherwise hashes the keyword.
 * Returns a KeywordObject
 * 
 * @param {string|RegExp} keyword 
 * @param {number} hash 
 * @param {type} typ
 * @returns {KeywordObject} 
 */
function createKeywordObj(keyword, typ, hash = null, ) {

    const hashed = hash === null ? watchlistHashGen(typ, keyword) : hash

    return new KeywordObject( {
        keyword: keyword,
        keywordHash: hashed,
    } )
}


function hashUserDictValues( networkKeywords ) {

    const permSet = new Set( [ permissionEnum.location, permissionEnum.watchlist ] );
    const excludedSet = new Set( [ typeEnum.phoneNumber, typeEnum.encodedEmail, typeEnum.zipCode, typeEnum.ipAddress ]) // these get hashed in importData

    for ( const perm of permSet ) {
        for ( const [t, valArr] of Object.entries(networkKeywords[perm]) ) {
            if ( !(excludedSet.has(t)) ) {
                var replacedArr = []
                for ( const keywordItem of valArr) {
                    replacedArr.push(createKeywordObj(keywordItem, t))
                }
                networkKeywords[perm][t] = replacedArr
            }
        }
    }

    return networkKeywords
}

export { getWatchlistDict, hashUserDictValues, createKeywordObj }