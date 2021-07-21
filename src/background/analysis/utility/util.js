function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

/**
 * A non-secure hash that takes str -> int
 * @param {string} str 
 * @returns {number}
 */
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


/**
 * Returns only the hostnames from a url. code from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
 * @param {string} url 
 * @returns {string} The hostname of the given URL. '' if URL undefined
 */
function extractHostname(url) {

  if (typeof url == 'undefined') return ''

  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

/**
 * Takes a url and returns its domain.
 * https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
 * @param {string} url 
 * @returns {string} The domain of a the inputted url, '' if input undefined
 */
function getHostname(url) {
  if (typeof url == 'undefined') return ''
  var domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
      // domain = second to last and last domain. could be (xyz.me.uk) or (xyz.uk)
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
          //this is using a ccTLD. set domain to include the actual host name
          domain = splitArr[arrLen - 3] + '.' + domain;
      }
  }
  return domain;
}


export { hashTypeAndPermission, extractHostname, getHostname }