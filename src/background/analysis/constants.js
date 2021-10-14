/**
 * Used in request filter. Javascript uses 2 bytes per char, so 200k byte cap lines up with
 * 100k char cap
 */
export const MAX_BYTE_LEN = 200000

/**
 * Used by heuristic funciton to choose when to analyze
 * Based on an analysis that the most labels come from shorter requests
 */
export const MAX_CHAR_LEN = 100000

/**
 * Used in setTimeout when changing favicon
 * 
 * Used to make a decision about which rocket svg to show as the favicon
 */
export const FIVE_SEC_IN_MILLIS = 5000

/**
 * Used to see if evidence is large for a first party
 * 
 * NOTE: This will change after testing has concluded
 * We would like to only have 1/3 of sites above this threshold and thus 
 * highlighted to the user as a site that takes a lot of data
 * 
 * Currently set to 30 based on general assumption. Testing required.
 */
export const EVIDENCE_THRESHOLD = 30

/**
 * Used in analyze.js for throttling cookie scan by time
 */

export const MINUTE_MILLISECONDS = 60000


/**
 * Constants used by coordinate search routine in searchFunctions.js
 * Defines 
 *  1) COORDINATE_PAIR_DIST : INT
 *    the definition of proximity in the string between lat/lng 
 *    (i.e they need to be at least this within COORDINATE_PAIR_DIST 
 *     num of chars to be considered a lat/lng pair )
 * 
 *  2) FINE_LOCATION_BOUND : FLOAT / COARSE_LOCATION_BOUND : FLOAT
 *      The definition of fine location and coarse location
 *      (i.e within how many degrees does the absolute value of the 
 *      potentiallat/lng need to be ) So if we choose 5.0, this means 
 *      and we have lat = 10.0 lng = 10.0.  (5.0, 15.0) would be a match.
 *      In the same example if we choose 2.5, (5.0, 15.0) would not be
 *      a match, but (7.5, 12.5) and (9.0, 9.0) would be matches.
 */

export const COORDINATE_PAIR_DIST = 300
export const FINE_LOCATION_BOUND = .1
export const COARSE_LOCATION_BOUND = 1.0