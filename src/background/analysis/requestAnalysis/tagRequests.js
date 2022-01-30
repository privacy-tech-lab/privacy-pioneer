/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import { getHostname } from '../utility/util.js'
// const parentJson = require('../../../assets/parents.json');
import parentJson from "../../../assets/parents.json";



/**
* Identifies if the request url hostname is in our list of parent companies, modified from Disconnect's entities.json,
* found here (https://github.com/disconnectme/disconnect-tracking-protection/blob/master/entities.json).
* Changes were made to compile the properties and resources lists from that json into one list, then filtered so that
* only companies with 5 or more related websites are searched for
*
* Defined in tagRequests.js
*
* Used in analyze.js
*
* @param {string} reqUrl The requestURL
* @param {object} parents The parents json from src/assets/parents.json
* @returns {string|null} The parent company of the website making the request
*/
function tagParent(reqUrl, parents = parentJson) {
    const reqHost = getHostname(reqUrl);
    for (const [entry, relationList] of Object.entries(parents)){
      if (entry!="__comment"){
        for (const [parent, urlLst] of Object.entries(relationList)){
          for (const url of urlLst) {
            if (reqHost.includes(url)){
              return parent
            }
          }
        }
      }
    }
    return null
  }

export { tagParent}