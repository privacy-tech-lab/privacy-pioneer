/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

/**
 * Converts an array of Evidence Objects into a csv string.
 * Only adds snippets for Evidence with indexes
 * Uses tabs as a separator, so \t will create a tab in the cell instead of appearing as '\t' in text
 * 
 * @param {Array<Evidence>} objArray 
 * @returns {string} A csv ready string
 */
 function buildTsvString(objArray) {

    /**
     * Wraps a row in quotes to escape \t if needed.
     * Example: strArray.push(escapeRowAndUpdate('\t \t \t \t \t \t asdfasdfasd \t \t \t', []));
     * This will add a cell that looks like: (start)          asdfasdfasd            (end)
     * 
     * @param {string} rowStr 
     * @param {Array} rowArr 
     * @returns {Array} rowArr but updated with rowStr
     */
    function escapeRowAndUpdate(rowStr, rowArr) {
        if ( rowStr != '' && rowStr.search(/[\t]/) != -1 ) {
            const escaped = '"'.concat(rowStr).concat('"') // wrap row in quotes to escape
            rowArr.push(escaped)
            return rowArr
        }
        rowArr.push(rowStr);
        return rowArr
    }

    /*
     * used to make sure that every column gets populated regardless of the keys
     * of a particular evidence
    */
    const columnMapping = {
        0: 'timestamp',
        1: 'permission',
        2: 'rootUrl',
        3: 'snippet',
        4: 'requestUrl',
        5: 'typ',
        6: 'index',
        7: 'firstPartyRoot',
        8: 'parentCompany',
        9: 'watchlistHash',
        10: 'extraDetail'
    }

    // initiate column titles
    const columnTitles = [
        'Timestamp', 'Permission', 'rootUrl', 'httpSnippet', 'reqUrl', 
        'Type', 'Index', 'FirstParty?', 'Parent', 'Extra Detail'
    ];

    var strArray = [ columnTitles.join('\t') ] //initialze the tsv with the titles.

    for (const evidenceObj of objArray) {
        var columnIndex = 0
        var rowArr = []
        for (const [header, value] of Object.entries(evidenceObj) ) {
            // get this object alligned with the columns
            while (columnIndex < 11 && columnMapping[columnIndex] != header) {
                rowArr.push('')
                columnIndex += 1
            }
            if (header != 'snippet') {
                rowArr = escapeRowAndUpdate(String(value), rowArr)
            }
            else {
                if (evidenceObj.index != -1) {
                    // if we have a snippet for this evidence object, we add 150 characters around the evidence to the csv
                    let start, finish
                    [start, finish] = evidenceObj.index
                    rowArr = escapeRowAndUpdate(value.substring(start - 150, finish + 150), rowArr)
                }
                else {
                    rowArr.push(''); // no snippet for this evidence object
                }
            }
            columnIndex += 1
        }
        // add a row of values
        strArray.push(rowArr.join('\t'));
    }
    // File Description
    strArray.push('Privacy Pioneer TSV export')

    // add all rows. separate rows.
    return strArray.join('\r');
}


export { buildTsvString }