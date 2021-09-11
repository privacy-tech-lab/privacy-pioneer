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
 */
export const FIVE_SEC_IN_MILLIS = 5000

/**
 * Used to see if evidence is large for a first party
 */
export const EVIDENCE_THRESHOLD = 30