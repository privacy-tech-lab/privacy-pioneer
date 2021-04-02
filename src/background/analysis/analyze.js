/*
analyze.js
================================================================================
- analyze.js analyzes network requests
*/

/*
For reference, here is a mockup of the Evidence type
const evidence = new Evidence({
  timestamp: "10/10/20",
  permission: "location",
  url: "facebook.com",
  snippet: "blahblah"
})
*/
import { Request, Evidence } from "./classModels.js"

import { evidence } from "../background.js"

// Temporary container to hold network requests while properties are being added from listener callbacks
const buffer = {}

// OnBeforeRequest callback
// Mozilla docs outlines several ways to parse incoming chunks of data; Feel free to experiment with others
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/StreamFilter/ondata
const onBeforeRequest = (details, loc, networkKeywords, urls) => {
  const filter = browser.webRequest.filterResponseData(details.requestId),
    decoder = new TextDecoder("utf-8"),
    data = []
  let request

  if (details.requestId in buffer) {
    request = buffer[details.requestId]
    request.details = details !== undefined ? details : null
    request.requestBody = details.requestBody !== undefined ? details.requestBody : null
  } else {
    request = new Request({
      id: details.requestId,
      details: details !== undefined ? details : null,
      requestBody: details.requestBody !== undefined ? details.requestBody : null,
    })
    buffer[details.requestId] = request
  }

  filter.onstart = (event) => {}

  filter.ondata = (event) => {
    const str = decoder.decode(event.data, { stream: true })
    data.push(str)
    filter.write(event.data)
  }

  filter.onerror = (event) => (request.error = filter.error)

  filter.onstop = async (event) => {
    filter.close()
    request.responseData = data.toString()
    resolveBuffer(request.id, loc, networkKeywords, urls)
  }
}

// OnBeforeSendHeaders callback
const onBeforeSendHeaders = (details, loc, networkKeywords, urls) => {
  let request

  if (details.requestId in buffer) {
    request = buffer[details.requestId]
    request.requestHeaders = details.requestHeaders !== undefined ? details.requestHeaders : null
  } else {
    request = new Request({
      id: details.requestId,
      requestHeaders: details.requestHeaders !== undefined ? details.requestHeaders : null,
    })
    buffer[details.requestId] = request
  }

  resolveBuffer(request.id, loc, networkKeywords, urls)
}

// OnHeadersReceived callback
const onHeadersReceived = (details, loc, networkKeywords, urls) => {
  let request

  if (details.requestId in buffer) {
    request = buffer[details.requestId]
    request.responseHeaders = details.responeHeaders !== undefined ? details.responseHeaders : null
  } else {
    request = new Request({
      id: details.requestId,
      responseHeaders: details.responeHeaders !== undefined ? details.responseHeaders : null,
    })
    buffer[details.requestId] = request
  }

  resolveBuffer(request.id, loc, networkKeywords, urls)
}

// Verifies if we have all the data for a request to be analyzed
function resolveBuffer(id, loc, networkKeywords, urls) {
  if (id in buffer) {
    const request = buffer[id]
    if (
      request.requestHeaders !== undefined &&
      request.responseHeaders !== undefined &&
      request.details !== undefined &&
      request.responseData !== undefined
    ) {
      delete buffer[id]
      // if this value is 0 the client likely denied location permission
      // or they could be on Null Island in the middle of the Gulf of Guinea
      if (loc[0] != 0 && loc[1] != 0) {
        coordinateSearch(request, loc);
      }
      // if this network keyword length is 0 then the geocoding failed
      // so no need to look through location keywords
      if (networkKeywords["location"].length != 0) {
        locationKeywordSearch(request, networkKeywords)
      }

      // search to see if the url comes up in our services list
      urlSearch(request, urls)
      userMatch(request)
      // console.log(evidence)
    }
  } else {
    // I don't think this will ever happen, but just in case, maybe a redirect?
    console.log(`ERROR: REQUEST WITH ID: ${id} NOT IN BUFFER`)
  }
}

// given the permission category, the url of the request, and the snippet
// from the request, get the current time in ms and add to our evidence list
function addToEvidenceList(perm, u, snip, id) {
  var ts = Date.now()
  const e = new Evidence( {
    timestamp: ts,
    permission: perm,
    url: u,
    snippet: snip,
  })
  evidence[id] = e
}

// Look in request for keywords from list of keywords built from user's
// location and the Google Maps geocoding API
function locationKeywordSearch(request, networkKeywords) {
  var strReq = JSON.stringify(request);
  var locElems = networkKeywords["location"]
  for (var j = 0; j < locElems.length; j++) {
    if (strReq.includes(locElems[j])) {
      console.log(locElems[j] + " detected for snippet " + strReq)
      addToEvidenceList("Location", request.details["url"], strReq, request.id)
    }
  }
}

// Gets the URL from the request and tries to match to our list of urls
function urlSearch(request, urls) {
  // First we can iterate through URLs
  var keys = Object.keys(urls["categories"]);
  for (var i = 0; i < keys.length; i++) {
    var cat = keys[i]
    var indivCats = urls["categories"][cat]
    for (var j = 0; j < indivCats.length; j++) {
      var obj = urls["categories"][cat][j]
      var indivKey = Object.keys(obj)
      var nextKey = Object.keys(urls["categories"][cat][j][indivKey])
      for (var k = 0; k < nextKey.length; k++) {
        var urlLst = urls["categories"][cat][j][indivKey][nextKey[k]]
        var url = request.details["url"]
        // if there are multiple URLs on the list we go here
        if (typeof urlLst === 'object') {
          for (var u = 0; u < urlLst.length; u++) {
            if (url.includes(urlLst[u])) {
              console.log(cat + " URL detected for " + urlLst[u])
              addToEvidenceList(cat, request.details["url"], request.details["url"], request.id)
            }
          }
        }
        // else we go here
        else {
          if (url.includes(urlLst)) {
            console.log(cat + " URL detected for " + urlLst)
            addToEvidenceList(cat, request.details["url"], request.details["url"], request.id)
          }
        }
      }
    }
  }
}

// try to build floats out of HTTP request strings to find users location
function coordinateSearch(request, locData) {
  var lat = locData[0]
  var lng = locData[1]
  var absLat = Math.abs(lat)
  var absLng = Math.abs(lng)

  //take request => JSON and build list of decimals
  var strReq = JSON.stringify(request);
  var decimalIndices = [];
  for (var i = 1; i < strReq.length - 1; i++) {
    if (strReq.charAt(i) === "." ) {
      decimalIndices.push(i);
    }
  }

  // iterate through decimals, and attempt to build float if there are numbers to either side of the decimal
  decimalIndices.forEach(index => {
    var potFloat = [];
    const oneLeft = strReq.charAt(index-1);
    const oneRight = strReq.charAt(index+1);

    if ( (!isNaN(oneLeft))  && (!isNaN(oneRight)) )
    {
      potFloat.push(oneLeft);
      potFloat.push(".");
      potFloat.push(oneRight);

      if (oneLeft != ' ' || oneRight != ' ') {
        //don't run routine when we have spaces on either side of the decimal

        const twoLeft = strReq.charAt(index-2);
        const threeLeft = strReq.charAt(index-3);
        if (!isNaN(twoLeft) && twoLeft != ' ') {
          potFloat.unshift(twoLeft);
        }
        if (!isNaN(threeLeft) && threeLeft != ' ') {
          potFloat.unshift(threeLeft);
        }

        var j = index + 2;
        var ctr = 0;
        while ( (!isNaN(strReq.charAt(j)) && (j < strReq.length) && (ctr < 14)) ) {
          if (strReq.charAt(j) === ' ') {
            break;
          }
          potFloat.push(strReq.charAt(j));
          j = j + 1;
          ctr = ctr + 1;
        }

        //here's the potential float
        const potentialMatch = potFloat.join('');

        //heursitic that longer decimals are likely to be locations
        if (potentialMatch.length > 10) {
          const asFloat = parseFloat(potentialMatch);
          // lazy bound of 1 for matches.
          const deltaLat = Math.abs(asFloat - absLat);
          const deltaLng = Math.abs(asFloat - absLng);

          if (deltaLat < 1 && deltaLat > .1 || deltaLng < 1 && deltaLng > .1) {
            console.log(`Lazy match for (${lat}, ${lng}) with ${potentialMatch}`);
            addToEvidenceList("Location", request.details["url"], strReq), request.id
          }
          if (deltaLat < .1 && deltaLng < .1) {
            conosole.log(`Tight match (within 7 miles) for (${lat}, ${lng}) with ${potentialMatch}`);
            addToEvidenceList("Location", request.details["url"], strReq, request.id)
        }
      }
    }
  }
 })
}

// takes an ssn string and builds a couple of representations
function buildSSN(ssn) {

  var ssn_arr = [];

  // 123-45-6789
  var pattern1 = [ssn.charAt(0), ssn.charAt(1), ssn.charAt(2), "-",
                  ssn.charAt(3), ssn.charAt(4), "-",
                  ssn.charAt(5), ssn.charAt(6), ssn.charAt(7), ssn.charAt(8)];
  
  ssn_arr.push(pattern1.join(""));

  // 123.45.6789
  var pattern2 = [ssn.charAt(0), ssn.charAt(1), ssn.charAt(2), "-",
                  ssn.charAt(3), ssn.charAt(4), "-",
                  ssn.charAt(5), ssn.charAt(6), ssn.charAt(7), ssn.charAt(8)];

  ssn_arr.push(pattern2.join(""));

  // 123-456789
  var pattern3 = [ssn.charAt(0), ssn.charAt(1), ssn.charAt(2), "-",
                ssn.charAt(3), ssn.charAt(4),
                ssn.charAt(5), ssn.charAt(6), ssn.charAt(7), ssn.charAt(8)];

  ssn_arr.push(pattern3.join(""));

  // 123 45 6789
  var pattern4 = [ssn.charAt(0), ssn.charAt(1), ssn.charAt(2), " ",
                  ssn.charAt(3), ssn.charAt(4), " ",
                ssn.charAt(5), ssn.charAt(6), ssn.charAt(7), ssn.charAt(8)];

  ssn_arr.push(pattern4.join(""));

  // 123 45-6789

  var pattern5 = [ssn.charAt(0), ssn.charAt(1), ssn.charAt(2), " ",
                  ssn.charAt(3), ssn.charAt(4), "-",
                ssn.charAt(5), ssn.charAt(6), ssn.charAt(7), ssn.charAt(8)];
  
  ssn_arr.push(pattern5.join(""));

  // 123-45 6789
  var pattern6 = [ssn.charAt(0), ssn.charAt(1), ssn.charAt(2), "-",
                  ssn.charAt(3), ssn.charAt(4), " ",
                  ssn.charAt(5), ssn.charAt(6), ssn.charAt(7), ssn.charAt(8)];

  ssn_arr.push(pattern6.join(""));

  return ssn_arr
}

// takes phone as len 10 string and returns a list of different constructions of the phone number (also as strings)
function buildPhone(phone) {

  var phone_arr = [];

  // like this 123-456-7890
  var pattern1 = [phone.charAt(0), phone.charAt(1), phone.charAt(2), "-", 
                    phone.charAt(3), phone.charAt(4), phone.charAt(5), "-",
                    phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];
  
  phone_arr.push(pattern1.join(""));

  // like this (415) 555-0132
  var pattern2 = ["(", phone.charAt(0), phone.charAt(1), phone.charAt(2), ")", " ", 
                    phone.charAt(3), phone.charAt(4), phone.charAt(5), "-",
                    phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];
  
  phone_arr.push(pattern2.join(""));

  // like this (415)555-0132
  var pattern3 = ["(", phone.charAt(0), phone.charAt(1), phone.charAt(2), ")",
                    phone.charAt(3), phone.charAt(4), phone.charAt(5), "-",
                    phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];

  phone_arr.push(pattern3.join(""));

  // like this +1 415 555 0132
  var pattern4 = ["+1", " ", phone.charAt(0), phone.charAt(1), phone.charAt(2), " ", 
                    phone.charAt(3), phone.charAt(4), phone.charAt(5), " ",
                    phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];
  
  phone_arr.push(pattern4.join(""));

  // like this 123.456.7890
  var pattern5 = [phone.charAt(0), phone.charAt(1), phone.charAt(2), ".",
                    phone.charAt(3), phone.charAt(4), phone.charAt(5), ".",
                    phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];
  phone_arr.push(pattern5.join(""));

  // like this 1.123.456.7890

  var pattern6 = ["1.", phone.charAt(0), phone.charAt(1), phone.charAt(2), ".",
                    phone.charAt(3), phone.charAt(4), phone.charAt(5), ".",
                    phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];
  phone_arr.push(pattern6.join(""));

  // like this 1-123-456-7890
  var pattern7 = ["1-", phone.charAt(0), phone.charAt(1), phone.charAt(2), "-",
                    phone.charAt(3), phone.charAt(4), phone.charAt(5), "-",
                    phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];
  
  phone_arr.push(pattern7.join(""));

  // like this +11234567890

  var pattern8 =  ["+1",phone.charAt(0), phone.charAt(1), phone.charAt(2), 
  phone.charAt(3), phone.charAt(4), phone.charAt(5),
  phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];

  phone_arr.push(pattern8.join(""));

  // like this 123-4567890

  var pattern9 =  [phone.charAt(0), phone.charAt(1), phone.charAt(2), "-",
  phone.charAt(3), phone.charAt(4), phone.charAt(5),
  phone.charAt(6), phone.charAt(7), phone.charAt(8), phone.charAt(9)];

  phone_arr.push(pattern9.join(""));

  return phone_arr

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

// it's tough to get as many patterns as you'd like because many of the known expressions create a distorting number of false positives
// for example looking for a 10 digit number is nonsense here

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

// to be implemented
function hashKeywords() {
  //pass
}

// until we have ui set up
var hardcodekeywords = ["example123456"];
var hardcodePhone = "9738608562";
var phone_posib = buildPhone(hardcodePhone);
console.log(phone_posib);
phone_posib.forEach(phone => hardcodekeywords.push(phone));

// preliminary list to test method
const regex_special_char = ['(', ')', '+', '.', '?']


// this will clean a string of escape characters
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

async function userMatch(request) {
  var currKeywords = hardcodekeywords

  let strReq = JSON.stringify(request)

  if (currKeywords != undefined) {
    currKeywords.forEach(keyword => {
      
      let fixed = escapeRegExp(keyword)
      // first approach is to look for case-insensitive regex match
      let re = new RegExp(`${fixed}`, "i");
      let result = strReq.match(re)
      if (result != null) {
        console.log(result)
      }
      // try for off-by-one regex match (heuristic that we will have less false positives for longer words)

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
              if (regex_special_char.includes(attempted_char)) {
                off_by_one.push('\\' + attempted_char)
              }
              else {off_by_one.push(attempted_char)}
            }
           }
          let attempt = off_by_one.join('');
          let reg = new RegExp(attempt, "i");
          let result = strReq.match(reg);
          if (result != null) {
            console.log(result);
          }
        }
      }
    })
  }

}


export { onBeforeRequest, onHeadersReceived, onBeforeSendHeaders }
