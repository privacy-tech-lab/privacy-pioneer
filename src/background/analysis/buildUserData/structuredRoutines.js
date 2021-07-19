import { PhoneNumberUtil } from "google-libphonenumber";


/**
 * Uses google's libphonenumber library to reformat the user's phone number
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
 * Takes the user's zip code and returns an array containing [stateAbrev, stateFull]. Uses structure of zipCode to do so.
 * Adapted from (https://stackoverflow.com/questions/28821804/how-can-i-quickly-determine-the-state-for-a-given-zipcode)
 *
 * @param {string} zipString
 * @returns {Array<string>|Array<undefined>} An array containing [undefined, undefined] if invalid input, or the state abreviation and name if valid input
 */
 function getState(zipString) {

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

    let st;
    let state;

    /* Code cases alphabetized by state */
    if (zipcode >= 35000 && zipcode <= 36999) {
        st = 'AL';
        state = /Alabama/i;
    } else if (zipcode >= 99500 && zipcode <= 99999) {
        st = 'AK';
        state = /Alaska/i;
    } else if (zipcode >= 85000 && zipcode <= 86999) {
        st = 'AZ';
        state = /Arizona/i;
    } else if (zipcode >= 71600 && zipcode <= 72999) {
        st = 'AR';
        state = /Arkansas/i;
    } else if (zipcode >= 90000 && zipcode <= 96699) {
        st = 'CA';
        state = /California/i;
    } else if (zipcode >= 80000 && zipcode <= 81999) {
        st = 'CO';
        state = /Colorado/i;
    } else if ((zipcode >= 6000 && zipcode <= 6389) || (zipcode >= 6391 && zipcode <= 6999)) {
        st = 'CT';
        state = /Connecticut/i;
    } else if (zipcode >= 19700 && zipcode <= 19999) {
        st = 'DE';
        state = /Delaware/i;
    } else if (zipcode >= 32000 && zipcode <= 34999) {
        st = 'FL';
        state = /Florida/i;
    } else if ( (zipcode >= 30000 && zipcode <= 31999) || (zipcode >= 39800 && zipcode <= 39999) ) {
        st = 'GA';
        state = /Georgia/i;
    } else if (zipcode >= 96700 && zipcode <= 96999) {
        st = 'HI';
        state = /Hawaii/i;
    } else if (zipcode >= 83200 && zipcode <= 83999) {
        st = 'ID';
        state = /Idaho/i;
    } else if (zipcode >= 60000 && zipcode <= 62999) {
        st = 'IL';
        state = /Illinois/i;
    } else if (zipcode >= 46000 && zipcode <= 47999) {
        st = 'IN';
        state = /Indiana/i;
    } else if (zipcode >= 50000 && zipcode <= 52999) {
        st = 'IA';
        state = /Iowa/i;
    } else if (zipcode >= 66000 && zipcode <= 67999) {
        st = 'KS';
        state = /Kansas/i;
    } else if (zipcode >= 40000 && zipcode <= 42999) {
        st = 'KY';
        state = /Kentucky/i;
    } else if (zipcode >= 70000 && zipcode <= 71599) {
        st = 'LA';
        state = /Louisiana/i;
    } else if (zipcode >= 3900 && zipcode <= 4999) {
        st = 'ME';
        state = /Maine/i;
    } else if (zipcode >= 20600 && zipcode <= 21999) {
        st = 'MD';
        state = /Maryland/i;
    } else if ( (zipcode >= 1000 && zipcode <= 2799) || (zipcode == 5501) || (zipcode == 5544 ) ) {
        st = 'MA';
        state = /Massachusetts/i;
    } else if (zipcode >= 48000 && zipcode <= 49999) {
        st = 'MI';
        state = /Michigan/i;
    } else if (zipcode >= 55000 && zipcode <= 56899) {
        st = 'MN';
        state = /Minnesota/i;
    } else if (zipcode >= 38600 && zipcode <= 39999) {
        st = 'MS';
        state = /Mississippi/i;
    } else if (zipcode >= 63000 && zipcode <= 65999) {
        st = 'MO';
        state = /Missouri/i;
    } else if (zipcode >= 59000 && zipcode <= 59999) {
        st = 'MT';
        state = /Montana/i;
    } else if (zipcode >= 27000 && zipcode <= 28999) {
        st = 'NC';
        state = /North.?Carolina/i;
    } else if (zipcode >= 58000 && zipcode <= 58999) {
        st = 'ND';
        state = /North.?Dakota/i;
    } else if (zipcode >= 68000 && zipcode <= 69999) {
        st = 'NE';
        state = /Nebraska/i;
    } else if (zipcode >= 88900 && zipcode <= 89999) {
        st = 'NV';
        state = /Nevada/i;
    } else if (zipcode >= 3000 && zipcode <= 3899) {
        st = 'NH';
        state = /New.?Hampshire/i;
    } else if (zipcode >= 7000 && zipcode <= 8999) {
        st = 'NJ';
        state = /New.?Jersey/i;
    } else if (zipcode >= 87000 && zipcode <= 88499) {
        st = 'NM';
        state = /New.?Mexico/i;
    } else if ( (zipcode >= 10000 && zipcode <= 14999) || (zipcode == 6390) || (zipcode == 501) || (zipcode == 544) ) {
        st = 'NY';
        state = /New.?York/i;
    } else if (zipcode >= 43000 && zipcode <= 45999) {
        st = 'OH';
        state = /Ohio/i;
    } else if ((zipcode >= 73000 && zipcode <= 73199) || (zipcode >= 73400 && zipcode <= 74999) ) {
        st = 'OK';
        state = /Oklahoma/i;
    } else if (zipcode >= 97000 && zipcode <= 97999) {
        st = 'OR';
        state = /Oregon/i;
    } else if (zipcode >= 15000 && zipcode <= 19699) {
        st = 'PA';
        state = /Pennsylvania/i;
    } else if (zipcode >= 300 && zipcode <= 999) {
        st = 'PR';
        state = /Puerto.?Rico/i;
    } else if (zipcode >= 2800 && zipcode <= 2999) {
        st = 'RI';
        state = /Rhode.?Island/i;
    } else if (zipcode >= 29000 && zipcode <= 29999) {
        st = 'SC';
        state = /South.?Carolina/i;
    } else if (zipcode >= 57000 && zipcode <= 57999) {
        st = 'SD';
        state = /South.?Dakota/i;
    } else if (zipcode >= 37000 && zipcode <= 38599) {
        st = 'TN';
        state = /Tennessee/i;
    } else if ( (zipcode >= 75000 && zipcode <= 79999) || (zipcode >= 73301 && zipcode <= 73399) ||  (zipcode >= 88500 && zipcode <= 88599) ) {
        st = 'TX';
        state = /Texas/i;
    } else if (zipcode >= 84000 && zipcode <= 84999) {
        st = 'UT';
        state = /Utah/i;
    } else if (zipcode >= 5000 && zipcode <= 5999) {
        st = 'VT';
        state = /Vermont/i;
    } else if ( (zipcode >= 20100 && zipcode <= 20199) || (zipcode >= 22000 && zipcode <= 24699) || (zipcode == 20598) ) {
        st = 'VA';
        state = /Virgina/i;
    } else if ( (zipcode >= 20000 && zipcode <= 20099) || (zipcode >= 20200 && zipcode <= 20599) || (zipcode >= 56900 && zipcode <= 56999) ) {
        st = 'DC';
        state = /Washington.?DC/i;
    } else if (zipcode >= 98000 && zipcode <= 99499) {
        st = 'WA';
        state = /Washington/i;
    } else if (zipcode >= 24700 && zipcode <= 26999) {
        st = 'WV';
        state = /West.?Virginia/i;
    } else if (zipcode >= 53000 && zipcode <= 54999) {
        st = 'WI';
        state = /Wisconsin/i;
    } else if (zipcode >= 82000 && zipcode <= 83199) {
        st = 'WY';
        state = /Wyoming/i;
    } else {
        st = undefined;
        state = undefined;
    }

    return [st, state];
  }


export { buildPhone, getState }
