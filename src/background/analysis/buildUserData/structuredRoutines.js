/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import { PhoneNumberUtil } from "google-libphonenumber";

/**
 * Uses google's libphonenumber library to reformat the user's phone number
 * 
 * Defined in structuredRoutines.js
 * 
 * Used in importSearch.js
 *
 * @param {string} userNumber
 * @returns {Array<strings>} An array of reformatted phone numbers. Empty list if invalid input.
 */
function buildPhone(userNumber) {

    const PNF = require('google-libphonenumber').PhoneNumberFormat;
    const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

    // check that user put in valid number. If yes, run routine.
    // harcoded US here
    if (phoneUtil.isValidNumber(phoneUtil.parse(userNumber, 'US'))) {

        const tel = phoneUtil.parse(userNumber, 'US')

        var formatList = []

        formatList.push(phoneUtil.formatInOriginalFormat(tel));
        formatList.push(phoneUtil.formatOutOfCountryCallingNumber(tel));
        formatList.push(phoneUtil.format(tel, PNF.E164));
        formatList.push(phoneUtil.format(tel, PNF.INTERNATIONAL));
        formatList.push(phoneUtil.format(tel, PNF.RFC3966).slice(4)); // this slice gets rid of "tel:" at the beginning of the string
        formatList.push(phoneUtil.format(tel, PNF.NATIONAL));
        formatList.push(String(tel.getNationalNumber()));
        formatList.push(phoneUtil.formatOutOfCountryCallingNumber(tel, 'US'));

        // make sure we get - separated
        const phone = String(tel.getNationalNumber());

        var pattern1 = [phone.charAt(0), phone.charAt(1), phone.charAt(2), "-",
                    phone.charAt(3), phone.charAt(4), phone.charAt(5), "-",
                    phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];

        formatList.push(pattern1.join(""));

        return formatList
    }

    else {
        return []
    }
}


/**
 * Takes the user's zip code and returns an array containing [regionAbrev, regionFull]. Uses structure of zipCode to do so.
 * Adapted from (https://stackoverflow.com/questions/28821804/how-can-i-quickly-determine-the-state-for-a-given-zipcode)
 * 
 * Defined in structuredRoutines.js
 * 
 * Used in importSearch.js
 *
 * @param {string} zipString
 * @returns {Array<any>|Array<undefined>} An array containing [undefined, undefined] if invalid input, or [st abrev string, region regex] if valid input
 */
 function getRegion(zipString) {

    /* Ensure param is a string to prevent unpredictable parsing results */
    if (typeof zipString !== 'string') {
        return;
    }

    /* Ensure we have exactly 5 characters to parse */
    if (zipString.length !== 5) {
        return;
    }

    /* Ensure we don't parse strings starting with 0 as octal values */
    const zipcode = parseInt(zipString, 10);

    let rgn;
    let region;

    /* Code cases alphabetized by region */
    if (zipcode >= 35000 && zipcode <= 36999) {
        rgn = 'AL';
        region = /Alabama/i;
    } else if (zipcode >= 99500 && zipcode <= 99999) {
        rgn = 'AK';
        region = /Alaska/i;
    } else if (zipcode >= 85000 && zipcode <= 86999) {
        rgn = 'AZ';
        region = /Arizona/i;
    } else if (zipcode >= 71600 && zipcode <= 72999) {
        rgn = 'AR';
        region = /Arkansas/i;
    } else if (zipcode >= 90000 && zipcode <= 96699) {
        rgn = 'CA';
        region = /California/i;
    } else if (zipcode >= 80000 && zipcode <= 81999) {
        rgn = 'CO';
        region = /Colorado/i;
    } else if ((zipcode >= 6000 && zipcode <= 6389) || (zipcode >= 6391 && zipcode <= 6999)) {
        rgn = 'CT';
        region = /Connecticut/i;
    } else if (zipcode >= 19700 && zipcode <= 19999) {
        rgn = 'DE';
        region = /Delaware/i;
    } else if (zipcode >= 32000 && zipcode <= 34999) {
        rgn = 'FL';
        region = /Florida/i;
    } else if ( (zipcode >= 30000 && zipcode <= 31999) || (zipcode >= 39800 && zipcode <= 39999) ) {
        rgn = 'GA';
        region = /Georgia/i;
    } else if (zipcode >= 96700 && zipcode <= 96999) {
        rgn = 'HI';
        region = /Hawaii/i;
    } else if (zipcode >= 83200 && zipcode <= 83999) {
        rgn = 'ID';
        region = /Idaho/i;
    } else if (zipcode >= 60000 && zipcode <= 62999) {
        rgn = 'IL';
        region = /Illinois/i;
    } else if (zipcode >= 46000 && zipcode <= 47999) {
        rgn = 'IN';
        region = /Indiana/i;
    } else if (zipcode >= 50000 && zipcode <= 52999) {
        rgn = 'IA';
        region = /Iowa/i;
    } else if (zipcode >= 66000 && zipcode <= 67999) {
        rgn = 'KS';
        region = /Kansas/i;
    } else if (zipcode >= 40000 && zipcode <= 42999) {
        rgn = 'KY';
        region = /Kentucky/i;
    } else if (zipcode >= 70000 && zipcode <= 71599) {
        rgn = 'LA';
        region = /Louisiana/i;
    } else if (zipcode >= 3900 && zipcode <= 4999) {
        rgn = 'ME';
        region = /Maine/i;
    } else if (zipcode >= 20600 && zipcode <= 21999) {
        rgn = 'MD';
        region = /Maryland/i;
    } else if ( (zipcode >= 1000 && zipcode <= 2799) || (zipcode == 5501) || (zipcode == 5544 ) ) {
        rgn = 'MA';
        region = /Massachusetts/i;
    } else if (zipcode >= 48000 && zipcode <= 49999) {
        rgn = 'MI';
        region = /Michigan/i;
    } else if (zipcode >= 55000 && zipcode <= 56899) {
        rgn = 'MN';
        region = /Minnesota/i;
    } else if (zipcode >= 38600 && zipcode <= 39999) {
        rgn = 'MS';
        region = /Mississippi/i;
    } else if (zipcode >= 63000 && zipcode <= 65999) {
        rgn = 'MO';
        region = /Missouri/i;
    } else if (zipcode >= 59000 && zipcode <= 59999) {
        rgn = 'MT';
        region = /Montana/i;
    } else if (zipcode >= 27000 && zipcode <= 28999) {
        rgn = 'NC';
        region = /North.?Carolina/i;
    } else if (zipcode >= 58000 && zipcode <= 58999) {
        rgn = 'ND';
        region = /North.?Dakota/i;
    } else if (zipcode >= 68000 && zipcode <= 69999) {
        rgn = 'NE';
        region = /Nebraska/i;
    } else if (zipcode >= 88900 && zipcode <= 89999) {
        rgn = 'NV';
        region = /Nevada/i;
    } else if (zipcode >= 3000 && zipcode <= 3899) {
        rgn = 'NH';
        region = /New.?Hampshire/i;
    } else if (zipcode >= 7000 && zipcode <= 8999) {
        rgn = 'NJ';
        region = /New.?Jersey/i;
    } else if (zipcode >= 87000 && zipcode <= 88499) {
        rgn = 'NM';
        region = /New.?Mexico/i;
    } else if ( (zipcode >= 10000 && zipcode <= 14999) || (zipcode == 6390) || (zipcode == 501) || (zipcode == 544) ) {
        rgn = 'NY';
        region = /New.?York/i;
    } else if (zipcode >= 43000 && zipcode <= 45999) {
        rgn = 'OH';
        region = /Ohio/i;
    } else if ((zipcode >= 73000 && zipcode <= 73199) || (zipcode >= 73400 && zipcode <= 74999) ) {
        rgn = 'OK';
        region = /Oklahoma/i;
    } else if (zipcode >= 97000 && zipcode <= 97999) {
        rgn = 'OR';
        region = /Oregon/i;
    } else if (zipcode >= 15000 && zipcode <= 19699) {
        rgn = 'PA';
        region = /Pennsylvania/i;
    } else if (zipcode >= 300 && zipcode <= 999) {
        rgn = 'PR';
        region = /Puerto.?Rico/i;
    } else if (zipcode >= 2800 && zipcode <= 2999) {
        rgn = 'RI';
        region = /Rhode.?Island/i;
    } else if (zipcode >= 29000 && zipcode <= 29999) {
        rgn = 'SC';
        region = /South.?Carolina/i;
    } else if (zipcode >= 57000 && zipcode <= 57999) {
        rgn = 'SD';
        region = /South.?Dakota/i;
    } else if (zipcode >= 37000 && zipcode <= 38599) {
        rgn = 'TN';
        region = /Tennessee/i;
    } else if ( (zipcode >= 75000 && zipcode <= 79999) || (zipcode >= 73301 && zipcode <= 73399) ||  (zipcode >= 88500 && zipcode <= 88599) ) {
        rgn = 'TX';
        region = /Texas/i;
    } else if (zipcode >= 84000 && zipcode <= 84999) {
        rgn = 'UT';
        region = /Utah/i;
    } else if (zipcode >= 5000 && zipcode <= 5999) {
        rgn = 'VT';
        region = /Vermont/i;
    } else if ( (zipcode >= 20100 && zipcode <= 20199) || (zipcode >= 22000 && zipcode <= 24699) || (zipcode == 20598) ) {
        rgn = 'VA';
        region = /Virgina/i;
    } else if ( (zipcode >= 20000 && zipcode <= 20099) || (zipcode >= 20200 && zipcode <= 20599) || (zipcode >= 56900 && zipcode <= 56999) ) {
        rgn = 'DC';
        region = /Washington.?DC/i;
    } else if (zipcode >= 98000 && zipcode <= 99499) {
        rgn = 'WA';
        region = /Washington/i;
    } else if (zipcode >= 24700 && zipcode <= 26999) {
        rgn = 'WV';
        region = /West.?Virginia/i;
    } else if (zipcode >= 53000 && zipcode <= 54999) {
        rgn = 'WI';
        region = /Wisconsin/i;
    } else if (zipcode >= 82000 && zipcode <= 83199) {
        rgn = 'WY';
        region = /Wyoming/i;
    } else {
        rgn = undefined;
        region = undefined;
    }

    return [rgn, region];
  }

const regionObj = {
    "AL": /Alabama/i,
    "AK": /Alaska/i,
    "AZ": /Arizona/i,
    "AR": /Arkansas/i,
    "CA": /California/i,
    "CO": /Colorado/i,
    "CT": /Connecticut/i,
    "DE": /Delaware/i,
    "FL": /Florida/i,
    "GA": /Georgia/i,
    "HI": /Hawaii/i,
    "ID": /Idaho/i,
    "IL": /Illinois/i,
    "IN": /Indiana/i,
    "IA": /Iowa/i,
    "KS": /Kansas/i,
    "KY": /Kentucky/i,
    "LA": /Louisiana/i,
    "ME": /Maine/i,
    "MD": /Maryland/i,
    "MA": /Massachusetts/i,
    "MI": /Michigan/i,
    "MN": /Minnesota/i,
    "MS": /Mississippi/i,
    "MO": /Missouri/i,
    "MT": /Montana/i,
    "NC": /North.?Carolina/i,
    "ND": /North.?Dakota/i,
    "NE": /Nebraska/i,
    "NV": /Nevada/i,
    "NH": /New.?Hampshire/i,
    "NJ": /New.?Jersey/i,
    "NM": /New.?Mexico/i,
    "NY": /New.?York/i,
    "OH": /Ohio/i,
    "OK": /Oklahoma/i,
    "OR": /Oregon/i,
    "PA": /Pennsylvania/i,
    "PR": /Puerto.?Rico/i,
    "RI": /Rhode.?Island/i,
    "SC": /South.?Carolina/i,
    "SD": /South.?Dakota/i,
    "TN": /Tennessee/i,
    "TX": /Texas/i,
    "UT": /Utah/i,
    "VT": /Vermont/i,
    "VA": /Virgina/i,
    "DC": /Washington.?DC/i,
    "WA": /Washington/i,
    "WV": /West.?Virginia/i,
    "WI": /Wisconsin/i,
    "WY": /Wyoming/i,
}

/**
 * Turns an IP into a regex that supports wildcard separators
 * @param {string} ipAddress
 * @returns {RegExp} ip param as a regex
 */
function buildIpRegex(ipAddress) {

    var buildRegexString = []

    for ( let i = 0; i < ipAddress.length; i ++) {

        const c = ipAddress.charAt(i)
        // add digits regularly
        if ( c >= '0' && c <= '9' ) {
            buildRegexString.push(c)
        }
        // optional non-digit otherwise
        else {
            buildRegexString.push('\\D?')
        }
    }

    const strIp = buildRegexString.join('')
    return new RegExp(strIp)

}

/**
 * Converts a zip code string into a regex
 * 
 * @param {string} zip 
 * @returns regex of the zip code with any non digit on either side
 */
function buildZipRegex(zip) {
    return new RegExp(`[^0-9]${zip}[^0-9]`)
}

/**
 * Converts a general keyword string into a regex
 * 
 * @param {string} genString 
 * @returns regex of the original string with optional characters instead of any non-alphanumeric characters
 */
function buildGeneralRegex(genString) {

    var regexString = []

    for ( let i = 0; i < genString.length; i ++) {

        const c = genString.charAt(i)
        // add digits regularly
        if ( (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') ) {
            regexString.push(c)
        }
        // optional non-digit otherwise
        else {
            regexString.push('\.?')
        }
    }

    const newGenReg = regexString.join('')
    return new RegExp(newGenReg)
}


export { buildPhone, getRegion, buildIpRegex, buildZipRegex, regionObj, buildGeneralRegex }
