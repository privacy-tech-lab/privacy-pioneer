/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

// preliminary list to test method
// \ ^ $ * + ? . ( ) | { } [ ]
const regexSpecialChar = [
  "(",
  ")",
  "+",
  ".",
  "?",
  "\\",
  "^",
  "$",
  "{",
  "}",
  "[",
  "]",
  "*",
];

/**
 * Takes a string and returns the same string ready to be turned into a regular expression.
 *
 * @param {string} text Any string
 * @returns {string} The same string but with escape characters so it can be properly turned into a regular expression
 */
export function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Looks for off-by-one matches in a string request
 *
 * @param {string} keyword
 * @param {string} strReq
 * @returns {void} logs to console.
 */
export function offByOneRegexSearch(keyword, strReq) {
  if (keyword.length > 5) {
    for (var i = 0; i < keyword.length; i++) {
      var off_by_one = [];
      for (var j = 0; j < keyword.length; j++) {
        if (i == j) {
          off_by_one.push(`.`);
        } else {
          let attempted_char = keyword.charAt(j);
          // add escape characters to special characters
          if (regexSpecialChar.includes(attempted_char)) {
            off_by_one.push("\\" + attempted_char);
          } else {
            off_by_one.push(attempted_char);
          }
        }
      }
      let attempt = off_by_one.join("");
      let reg = new RegExp(attempt, "i");
      let result = strReq.match(reg);
      if (result != null) {
        console.log(result);
      }
    }
  }
}
