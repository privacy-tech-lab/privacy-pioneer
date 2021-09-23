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
