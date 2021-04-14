// preliminary list to test method
// \ ^ $ * + ? . ( ) | { } [ ]
const regexSpecialChar = ['(', ')', '+', '.', '?', '\\', '^', '$', '{', '}', '[', ']', '*']

// this will clean a string of escape characters
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }


function offByOneRegexSearch(keyword, request) {
    if (keyword.length > 5) {
      for (var i = 0; i < keyword.length; i++) {
        var off_by_one = [];
        for (var j = 0; j < keyword.length; j ++) {
          if (i == j) {
            off_by_one.push(`.`)
          }
          else {
            let attempted_char = keyword.charAt(j)
            // add escape characters to special characters
            if (RegexSpecialChar.includes(attempted_char)) {
            off_by_one.push('\\' + attempted_char)
            }
            else {off_by_one.push(attempted_char)}}
          }
          let attempt = off_by_one.join('');
          let reg = new RegExp(attempt, "i");
          let result = strReq.match(reg);
          if (result != null) {
              console.log(result);
            }
          }
        }
      }

// function to look for ANY email regex and log them to console
// I think these patterns are pretty good.
function emailSearch(strReq) {
    let re = new RegExp("/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/")
    // alt regex
    let realt = new RegExp("^([a-zA-Z0-9]+(?:[.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,7})$")
    let result = strReq.match(re)
    if (result != null)
    {
      console.log(result)
    }
    let altresult = strReq.match(realt)
    if (altresult != null)
    {
      console.log(altresult)
    }
  
  }
  
  // looks for ANY phone number regex and log them to console
  // should add some more patterns. The difficulty is finding a pattern that does NOT include 1234567890. We have a good set of patterns in the build phone number function
  function phoneSearch(strReq) {
    var reglist = []
    // hyphen separated
    reglist.push(new RegExp("^[2-9]\\d{2}-\\d{3}-\\d{4}$"))
    // (910)456-7890 | (910)456-8970 x12 | (910)456-8970 1211
    reglist.push(new RegExp("^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$"))
  
    reglist.forEach(re => {
      let result = strReq.match(re)
      if (result != null) {
        console.log(result)
        console.log(re)
      }
    } )
  }

export { regexSpecialChar, escapeRegExp, offByOneRegexSearch }