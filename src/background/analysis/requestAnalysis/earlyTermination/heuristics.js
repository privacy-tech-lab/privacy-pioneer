/**
 * 100000 choice based on analysis here: https://github.com/privacy-tech-lab/privacy-pioneer/issues/297
 * 
 * @param {string} strReq HTTP Request as a string
 * @returns {boolean} True to terminate, otherwise false
 */
function lengthHeuristic(strReq) {
    const requestLen = strReq.length
    return requestLen > 100000
}

export { lengthHeuristic }