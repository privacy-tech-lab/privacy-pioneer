/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

/**
 * Used in request filter. Javascript uses 2 bytes per char, so 200k byte cap lines up with
 * 100k char cap
 * @type {number}
 */
export const MAX_BYTE_LEN = 200000;

/**
 * Used by heuristic funciton to choose when to analyze
 * Based on an analysis that the most labels come from shorter requests
 * @type {number}
 */
export const MAX_CHAR_LEN = 100000;

/**
 * Used in setTimeout when changing favicon
 *
 * Used to make a decision about which rocket svg to show as the favicon
 * @type {number}
 */
export const FIVE_SEC_IN_MILLIS = 5000;

/**
 * Used to see if evidence is large for a first party
 *
 * NOTE: This will change after testing has concluded
 * We would like to only have 1/3 of sites above this threshold and thus
 * highlighted to the user as a site that takes a lot of data
 * @type {number}
 */
export const EVIDENCE_THRESHOLD = 45;

/**
 * Used in analyze.js for throttling cookie scan by time
 * @type {number}
 */
export const MINUTE_MILLISECONDS = 60000;

/**
 * Constants used by coordinate search routine in searchFunctions.js
 * Defines
 *  1) COORDINATE_PAIR_DIST : INT
 *    the definition of proximity in the string between lat/lng
 *    (i.e they need to be at least this within COORDINATE_PAIR_DIST
 *     num of chars to be considered a lat/lng pair )
 *
 *    So if, we choose COORDINATE_PAIR_DIST = 15 and we find your exact coordinates
 *    but with lng 50 chars apart from lat, we create neither the fine location
 *    or coarse location label.
 *
 *    Pair dist equally affects fine/coarse location
 *
 *  2) FINE_LOCATION_BOUND : FLOAT / COARSE_LOCATION_BOUND : FLOAT
 *      The definition of fine location and coarse location
 *      (i.e within how many degrees does the absolute value of the
 *      potentiallat/lng need to be )
 *
 *      So if we choose BOUND = 5.0,
 *      and we have users lat = 10.0 lng = 10.0 from the browser location API,
 *      (5.0, 15.0) would be a match.
 *      In the same example if we choose BOUND = 2.5, (5.0, 15.0) would not be
 *      a match, but (7.5, 12.5) and (9.0, 9.0) would be matches.
 */

/**
 * @type {number}
 */
export const COORDINATE_PAIR_DIST = 300;
/**
 * @type {number}
 */
export const FINE_LOCATION_BOUND = 0.1;
/**
 * @type {number}
 */
export const COARSE_LOCATION_BOUND = 1.0;
