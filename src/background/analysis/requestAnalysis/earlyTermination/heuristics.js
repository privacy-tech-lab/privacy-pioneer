/**
 * 
 * @param {string} strReq HTTP Request as a string
 * @returns {boolean} True to terminate, otherwise false
 */
function lengthHeuristic(strReq) {
    const requestLen = strReq.length
    return requestLen > 15000
}

export { lengthHeuristic }