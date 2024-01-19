/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

/**
 * Uses google's libphonenumber library to reformat the user's phone number
 *
 * Defined in structuredRoutines.js
 *
 * Used in importSearch.js
 *
 * @param {string} userNumber
 * @returns {string[]} An array of reformatted phone numbers. Empty list if invalid input.
 */
export function buildPhone(userNumber) {
  const PNF = require("google-libphonenumber").PhoneNumberFormat;
  const phoneUtil =
    require("google-libphonenumber").PhoneNumberUtil.getInstance();

  // check that user put in valid number. If yes, run routine.
  // harcoded US here
  if (phoneUtil.isValidNumber(phoneUtil.parse(userNumber, "US"))) {
    const tel = phoneUtil.parse(userNumber, "US");

    var formatList = [];

    formatList.push(phoneUtil.formatInOriginalFormat(tel));
    formatList.push(phoneUtil.formatOutOfCountryCallingNumber(tel));
    formatList.push(phoneUtil.format(tel, PNF.E164));
    formatList.push(phoneUtil.format(tel, PNF.INTERNATIONAL));
    formatList.push(phoneUtil.format(tel, PNF.RFC3966).slice(4)); // this slice gets rid of "tel:" at the beginning of the string
    formatList.push(phoneUtil.format(tel, PNF.NATIONAL));
    formatList.push(String(tel.getNationalNumber()));
    formatList.push(phoneUtil.formatOutOfCountryCallingNumber(tel, "US"));

    // make sure we get - separated
    const phone = String(tel.getNationalNumber());

    var pattern1 = [
      phone.charAt(0),
      phone.charAt(1),
      phone.charAt(2),
      "-",
      phone.charAt(3),
      phone.charAt(4),
      phone.charAt(5),
      "-",
      phone.charAt(6),
      phone.charAt(7),
      phone.charAt(8),
      phone.charAt(9),
    ];

    formatList.push(pattern1.join(""));

    return formatList;
  } else {
    return [];
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
 * @param {string} region
 * @returns {RegExp} An array containing [undefined, undefined] if invalid input, or [st abrev string, state regex] if valid input
 */
export function getRegion(region) {
  region = region.replace(/\s/g, "\\D?"); // \s is space character or equiv
  region = region.replace(/\./g, "\\D?"); // \. is "." character
  region = region.replace(/-/g, "\\D?"); // also replace dashes with optional non digits (mostly for INTL)
  return new RegExp(region, "i");
}

/**
 * Turns an IP into a regex that supports wildcard separators
 * @param {string} ipAddress
 * @returns {RegExp} ip param as a regex
 */
export function buildIpRegex(ipAddress) {
  var buildRegexString = [];

  for (let i = 0; i < ipAddress.length; i++) {
    const c = ipAddress.charAt(i);
    // add digits regularly
    if (c >= "0" && c <= "9") {
      buildRegexString.push(c);
    }
    // optional non-digit otherwise
    else {
      buildRegexString.push("\\D?");
    }
  }

  const strIp = buildRegexString.join("");
  return new RegExp(strIp);
}

/**
 * Converts a zip code string into a regex
 *
 * @param {string} zip
 * @returns {RegExp} regex of the zip code with any non digit on either side
 */
export function buildZipRegex(zip) {
  if (!isNaN(parseInt(zip))) {
    zip = zip.replace(/\s/g, "\\D?"); // \s is space character or equiv
    zip = zip.replace(/-/g, "\\D?"); // also replace dashes with optional non digits (mostly for INTL)
    zip = "[^0-9]".concat(zip).concat("[^0-9]");
    return new RegExp(zip);
  }
  //for zips including letters
  else {
    zip = zip.replace(/\s/g, "\\D?"); // \s is space character or equiv
    zip = zip.replace(/-/g, "\\D?"); // also replace dashes with optional non digits (mostly for INTL)
    return new RegExp(zip);
  }
}

/**
 * Converts a general keyword string into a regex
 *
 * @param {string} genString
 * @returns {RegExp} regex of the original string with optional characters instead of any non-alphanumeric characters
 */
export function buildGeneralRegex(genString) {
  var regexString = [];

  for (let i = 0; i < genString.length; i++) {
    const c = genString.charAt(i);
    // add digits regularly
    if (new RegExp(/\p{L}/, "u").test(c)){
      regexString.push(c);
    }
    // optional non-digit otherwise
    else {
      regexString.push(".?");
    }
  }

  const newGenReg = regexString.join("");
  return new RegExp(newGenReg);
}