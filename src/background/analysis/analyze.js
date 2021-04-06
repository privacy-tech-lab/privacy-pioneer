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
  type: "zipcode",
  rooturl: "facebook.com",
  requesturl: "facebook.com/js"
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
const onBeforeRequest = (details, data) => {
  var loc = data[0]
  var networkKeywords = data[1]
  var urls = data[2]
  const filter = browser.webRequest.filterResponseData(details.requestId),
    decoder = new TextDecoder("utf-8"),
    d = []
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
    d.push(str)
    filter.write(event.data)
  }

  filter.onerror = (event) => (request.error = filter.error)

  filter.onstop = async (event) => {
    filter.close()
    request.responseData = d.toString()
    resolveBuffer(request.id, loc, networkKeywords, urls)
  }
}

// OnBeforeSendHeaders callback
const onBeforeSendHeaders = (details, data) => {
  var loc = data[0]
  var networkKeywords = data[1]
  var urls = data[2]
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
const onHeadersReceived = (details, data) => {
  var loc = data[0]
  var networkKeywords = data[1]
  var urls = data[2]
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
    }
  } else {
    // I don't think this will ever happen, but just in case, maybe a redirect?
    console.log(`ERROR: REQUEST WITH ID: ${id} NOT IN BUFFER`)
  }
}

// given a type and a permission creates a unique has so there are no repeats
// in our indexedDB. THIS IS NOT A SECURE HASH, but rather just a quick way
// to convert a regular string into digits
// taken basically from: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
function hashTypeAndPermission(str) {
  var hash = 0,
     i,
     chr;
   for (i = 0; i < str.length; i++) {
     chr = str.charCodeAt(i);
     hash = (hash << 5) - hash + chr;
     hash |= 0;
   }
   return hash;
}

// takes in full url and extracts just the domain host
const getHostname = (url) => {
  // use URL constructor and return hostname
  try {
    return new URL(url).hostname;
  }
  catch(err) {
    console.log(err)
    return url
  }
}

// given the permission category, the url of the request, and the snippet
// from the request, get the current time in ms and add to our evidence list
function addToEvidenceList(perm, rootU, snip, requestU, t) {
  var ts = Date.now()
  if (rootU == undefined) {
    rootU = requestU
  }
  var rootUrl = getHostname(rootU)
  const e = new Evidence( {
    timestamp: ts,
    permission: perm,
    rootUrl: rootUrl,
    snippet: snip,
    requestUrl: requestU,
    typ: t
  })
  var evidenceDict = {}
  var typeHashed = hashTypeAndPermission(perm.concat(t));
  evidenceDict[typeHashed] = e
  var permDict = {}
  permDict[perm] = evidenceDict

    // if there already exists this specific type and permission we don't want to add it
  if (rootUrl in evidence) {
    var rootDict = evidence[rootUrl]
    if (perm in evidence[rootUrl]) {
      var permDictNew = evidence[rootUrl][perm]
      if (typeHashed in evidence[rootUrl][perm]) {
        // do nothing
      }
        // if it doesn't exist let's add it
      else {
        permDictNew[typeHashed] = e
        evidence[rootUrl] = permDictNew
      }
    }
      // if it doesn't exist let's add it
    else {
      rootDict[perm] = evidenceDict
      evidence[rootUrl] = rootDict
    }
  }
  // if it doesn't exist let's add it
  else {
    evidence[rootUrl] = permDict
  }

  console.log(evidence)
}

// Look in request for keywords from list of keywords built from user's
// location and the Google Maps geocoding API
function locationKeywordSearch(request, networkKeywords) {
  var strReq = JSON.stringify(request);
  var locElems = networkKeywords["location"]
  for (var j = 0; j < locElems.length; j++) {
    if (strReq.includes(locElems[j])) {
      console.log(locElems[j] + " detected for snippet " + strReq)
      addToEvidenceList("Location", request.details["originUrl"], strReq, request.details["url"], locElems[j])
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
              addToEvidenceList(cat, request.details["originUrl"], "null", request.details["url"], cat)
            }
          }
        }
        // else we go here
        else {
          if (url.includes(urlLst)) {
            console.log(cat + " URL detected for " + urlLst)
            addToEvidenceList(cat, request.details["originUrl"], "null", request.details["url"], cat)
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
            addToEvidenceList("Location", request.details["originUrl"], strReq, request.details["url"], "coordinates")
          }
          if (deltaLat < .1 && deltaLng < .1) {
            conosole.log(`Tight match (within 7 miles) for (${lat}, ${lng}) with ${potentialMatch}`);
            addToEvidenceList("Location", request.details["originUrl"], strReq, request.details["url"], "coordinates")
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


// I found this on stack overflow. Maybe we think it's useful.
// function gets passed a string that must be length 5.
// returns a len 2 array with [abbreviation, full state name]
// It's pretty good for limiting how much information the user has to put in.
function getState(zipString) {

  /* Ensure param is a string to prevent unpredictable parsing results */
  if (typeof zipString !== 'string') {
      return;
  }

  /* Ensure we have exactly 5 characters to parse */
  if (zipString.length !== 5) {
      return;
  }

  /* Ensure we don't parse strings starting with 0 as octal values */
  const zipcode = parseInt(zipString, 10);

  let st;
  let state;

  /* Code cases alphabetized by state */
  if (zipcode >= 35000 && zipcode <= 36999) {
      st = 'AL';
      state = 'Alabama';
  } else if (zipcode >= 99500 && zipcode <= 99999) {
      st = 'AK';
      state = 'Alaska';
  } else if (zipcode >= 85000 && zipcode <= 86999) {
      st = 'AZ';
      state = 'Arizona';
  } else if (zipcode >= 71600 && zipcode <= 72999) {
      st = 'AR';
      state = 'Arkansas';
  } else if (zipcode >= 90000 && zipcode <= 96699) {
      st = 'CA';
      state = 'California';
  } else if (zipcode >= 80000 && zipcode <= 81999) {
      st = 'CO';
      state = 'Colorado';
  } else if ((zipcode >= 6000 && zipcode <= 6389) || (zipcode >= 6391 && zipcode <= 6999)) {
      st = 'CT';
      state = 'Connecticut';
  } else if (zipcode >= 19700 && zipcode <= 19999) {
      st = 'DE';
      state = 'Delaware';
  } else if (zipcode >= 32000 && zipcode <= 34999) {
      st = 'FL';
      state = 'Florida';
  } else if ( (zipcode >= 30000 && zipcode <= 31999) || (zipcode >= 39800 && zipcode <= 39999) ) {
      st = 'GA';
      state = 'Georgia';
  } else if (zipcode >= 96700 && zipcode <= 96999) {
      st = 'HI';
      state = 'Hawaii';
  } else if (zipcode >= 83200 && zipcode <= 83999) {
      st = 'ID';
      state = 'Idaho';
  } else if (zipcode >= 60000 && zipcode <= 62999) {
      st = 'IL';
      state = 'Illinois';
  } else if (zipcode >= 46000 && zipcode <= 47999) {
      st = 'IN';
      state = 'Indiana';
  } else if (zipcode >= 50000 && zipcode <= 52999) {
      st = 'IA';
      state = 'Iowa';
  } else if (zipcode >= 66000 && zipcode <= 67999) {
      st = 'KS';
      state = 'Kansas';
  } else if (zipcode >= 40000 && zipcode <= 42999) {
      st = 'KY';
      state = 'Kentucky';
  } else if (zipcode >= 70000 && zipcode <= 71599) {
      st = 'LA';
      state = 'Louisiana';
  } else if (zipcode >= 3900 && zipcode <= 4999) {
      st = 'ME';
      state = 'Maine';
  } else if (zipcode >= 20600 && zipcode <= 21999) {
      st = 'MD';
      state = 'Maryland';
  } else if ( (zipcode >= 1000 && zipcode <= 2799) || (zipcode == 5501) || (zipcode == 5544 ) ) {
      st = 'MA';
      state = 'Massachusetts';
  } else if (zipcode >= 48000 && zipcode <= 49999) {
      st = 'MI';
      state = 'Michigan';
  } else if (zipcode >= 55000 && zipcode <= 56899) {
      st = 'MN';
      state = 'Minnesota';
  } else if (zipcode >= 38600 && zipcode <= 39999) {
      st = 'MS';
      state = 'Mississippi';
  } else if (zipcode >= 63000 && zipcode <= 65999) {
      st = 'MO';
      state = 'Missouri';
  } else if (zipcode >= 59000 && zipcode <= 59999) {
      st = 'MT';
      state = 'Montana';
  } else if (zipcode >= 27000 && zipcode <= 28999) {
      st = 'NC';
      state = 'North Carolina';
  } else if (zipcode >= 58000 && zipcode <= 58999) {
      st = 'ND';
      state = 'North Dakota';
  } else if (zipcode >= 68000 && zipcode <= 69999) {
      st = 'NE';
      state = 'Nebraska';
  } else if (zipcode >= 88900 && zipcode <= 89999) {
      st = 'NV';
      state = 'Nevada';
  } else if (zipcode >= 3000 && zipcode <= 3899) {
      st = 'NH';
      state = 'New Hampshire';
  } else if (zipcode >= 7000 && zipcode <= 8999) {
      st = 'NJ';
      state = 'New Jersey';
  } else if (zipcode >= 87000 && zipcode <= 88499) {
      st = 'NM';
      state = 'New Mexico';
  } else if ( (zipcode >= 10000 && zipcode <= 14999) || (zipcode == 6390) || (zipcode == 501) || (zipcode == 544) ) {
      st = 'NY';
      state = 'New York';
  } else if (zipcode >= 43000 && zipcode <= 45999) {
      st = 'OH';
      state = 'Ohio';
  } else if ((zipcode >= 73000 && zipcode <= 73199) || (zipcode >= 73400 && zipcode <= 74999) ) {
      st = 'OK';
      state = 'Oklahoma';
  } else if (zipcode >= 97000 && zipcode <= 97999) {
      st = 'OR';
      state = 'Oregon';
  } else if (zipcode >= 15000 && zipcode <= 19699) {
      st = 'PA';
      state = 'Pennsylvania';
  } else if (zipcode >= 300 && zipcode <= 999) {
      st = 'PR';
      state = 'Puerto Rico';
  } else if (zipcode >= 2800 && zipcode <= 2999) {
      st = 'RI';
      state = 'Rhode Island';
  } else if (zipcode >= 29000 && zipcode <= 29999) {
      st = 'SC';
      state = 'South Carolina';
  } else if (zipcode >= 57000 && zipcode <= 57999) {
      st = 'SD';
      state = 'South Dakota';
  } else if (zipcode >= 37000 && zipcode <= 38599) {
      st = 'TN';
      state = 'Tennessee';
  } else if ( (zipcode >= 75000 && zipcode <= 79999) || (zipcode >= 73301 && zipcode <= 73399) ||  (zipcode >= 88500 && zipcode <= 88599) ) {
      st = 'TX';
      state = 'Texas';
  } else if (zipcode >= 84000 && zipcode <= 84999) {
      st = 'UT';
      state = 'Utah';
  } else if (zipcode >= 5000 && zipcode <= 5999) {
      st = 'VT';
      state = 'Vermont';
  } else if ( (zipcode >= 20100 && zipcode <= 20199) || (zipcode >= 22000 && zipcode <= 24699) || (zipcode == 20598) ) {
      st = 'VA';
      state = 'Virgina';
  } else if ( (zipcode >= 20000 && zipcode <= 20099) || (zipcode >= 20200 && zipcode <= 20599) || (zipcode >= 56900 && zipcode <= 56999) ) {
      st = 'DC';
      state = 'Washington DC';
  } else if (zipcode >= 98000 && zipcode <= 99499) {
      st = 'WA';
      state = 'Washington';
  } else if (zipcode >= 24700 && zipcode <= 26999) {
      st = 'WV';
      state = 'West Virginia';
  } else if (zipcode >= 53000 && zipcode <= 54999) {
      st = 'WI';
      state = 'Wisconsin';
  } else if (zipcode >= 82000 && zipcode <= 83199) {
      st = 'WY';
      state = 'Wyoming';
  } else {
      st = 'none';
      state = 'none';
      console.log('No state found matching', zipcode);
  }

  return [st, state];
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

// until we have ui set up
var hardcodeKeywords = ["example123456"];
let hardcodePhone = "9738608562";
// be careful to not push this up while testing!
let hardcodeSSN = "";
let hardcodeZip = "06459"

let abbrevation, stateName;
[abbrevation, stateName] = getState(hardcodeZip);
hardcodeKeywords.push(abbrevation);
hardcodeKeywords.push(stateName);

// add phone/ssn variations into keyword list that will be iterated through by user match function.
var ssn_posib = buildSSN(hardcodeSSN);
var phone_posib = buildPhone(hardcodePhone);
phone_posib.forEach(phone => hardcodeKeywords.push(phone));
ssn_posib.forEach(ssn => hardcodeKeywords.push(ssn));

console.log(hardcodeKeywords);

// preliminary list to test method
const regex_special_char = ['(', ')', '+', '.', '?']


// this will clean a string of escape characters
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

async function userMatch(request) {
  var currKeywords = hardcodeKeywords

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
