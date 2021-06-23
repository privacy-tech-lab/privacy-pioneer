import { getHostname } from "./util.js"
import { evidenceKeyval } from "./openDB.js"
import { Evidence, typeEnum } from "./classModels.js"
import { ipSearch } from "./searchFunctions.js"
const parentJson = require('../../assets/parents.json')

/**
 * 
 * @param {string} perm The permission of this piece of evidence
 * @param {string} rootU The rootUrl of the request
 * @param {string} snip The request as a string
 * @param {string} requestU The requestUrl of the request
 * @param {string} t The type of the evidence
 * @param {Array|undefined} i The index (where in the request string) of the evidence (Either an array or length 2 or undefined)
 * @returns {void} Nothing. The evidence DB is updated.
 * 
 * addToEvidenceList is the function that is called to populate the DB with a piece of evidence. Called by the functions in 
 * searchFuncitons.js. The function is async because it makes calls to the DB and the browser history. Pieces of evidence are stored as 
 * Evidence objects. These objects are stored at keys of their rootUrl. At each rootUrl, there is a dictionary with a permission level
 * (defined in permissionEnum) and then a further type level (defined in typeEnum). We store only one piece of evidence per permssion/type for a
 * given rootUrl and a maximum of 5 pieces of evidence in total for a permission/type.
 */
async function addToEvidenceList(perm, rootU, snip, requestU, t, i) {
  
  var ts = Date.now()
  if (rootU == undefined) {
      // if the root URL is not in the request then let's just not save it
      // as we cannot be sure what domain it is actually being called from
      // we should, however, print the request to console for now just to see
      // how often this is happening
    console.log("No root URL detected for snippet:")
    console.log(perm, snip, requestU, t)
    return
  }

   // hacky way to deal with the way we iterate through the disconnect json
   if (perm.includes("fingerprint")) { perm = "fingerprinting"}
   if (perm.includes("advertising")) { t = "analytics" }
   if (perm.includes("analytics")) { perm = "advertising" }
    
  var rootUrl = getHostname(rootU)
  var reqUrl = getHostname(requestU)

  // gets the ten most recently visited websites
  /**
   * @var historyQuery Searches most recent sites opened in the browser
   */
  var historyQuery = browser.history.search({text: "", maxResults: 10})

  /**
   * @param {Promise} queryData 
   * @returns {boolean} Boolean. Whether or not the given request has a first party rootUrl.
   */
  function firstPartyCheck(queryData) {

    let recentlyVisited = new Set()
    for (let page of queryData) {
      recentlyVisited.add(getHostname(page.url));
    }
    
    return recentlyVisited.has(rootUrl)
  }
 
  /**
   * Identifies if the request url hostname is in our list of parent companies, modified from Disconnect's entities.json, 
   * found here (https://github.com/disconnectme/disconnect-tracking-protection/blob/master/entities.json). 
   * Changes were made to compile the properties and resources lists from that json into one list, then filtered so that 
   * only companies with 5 or more related websites are searched for
   * 
   * @param {string} reqHost The request host name
   * @param {object} parents The parents json from src/assets/parents.json
   * @returns {string|null} The parent company of the website making the request
   */
  function getParent(reqHost, parents = parentJson){
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

  // after we queried the browser history, we can proceed with updating evidence
  historyQuery.then( queryData => {

    let isFirstParty = firstPartyCheck(queryData)
    let requestParent = getParent(reqUrl)
    setEvidence(isFirstParty, requestParent)

    /**
     * Takes the parameters from the outer addToEvidenceList function, queries what's currently in the database at
     * the given rootUrl and updates the DB accordingly. 
     * 
     * @param {boolean} firstParty Whether or not the evidence has a rootUrl that the user visited
     * @param {string} requestParent Parent company of site making the request, if possible
     * @returns {void} Nothing. Populates the DB with the new evidence.
     *
     */
    async function setEvidence(firstParty, requestParent) {

      var evidence = await evidenceKeyval.get(rootUrl)
    
      const e = new Evidence( {
        timestamp: ts,
        permission: perm,
        rootUrl: rootUrl,
        snippet: snip,
        requestUrl: requestU,
        typ: t,
        index: i,
        firstPartyRoot: firstParty,
        parentCompany: requestParent
      } )
    
      // if we don't have evidence yet, we initialize it as an empty dict
      if (evidence === undefined) {
        evidence = {}
      }
    
      // if we have this rootUrl in evidence already we check if we already have store_label
      if (Object.keys(evidence).length !== 0) {
        if (perm in evidence) { 
          // if type is in the permission
          if (t in evidence[perm]) {
            // if we have less than 5 different reqUrl's for this permission and this is a unique reqUrl, we save the evidence
            if ((Object.keys(evidence[perm][t]).length < 5) && !(reqUrl in evidence[perm][t] )) {
              evidence[perm][t][reqUrl] = e
              evidenceKeyval.set(rootUrl, evidence)
            }
          }
          else { // we don't have this type yet, so we initialize it
            evidence[perm][t] = {}
            evidence[perm][t][reqUrl] = e
            evidenceKeyval.set(rootUrl, evidence)
          }
        }
        else { // we don't have this permission yet so we initialize
          evidence[perm] = {}
          
          // init dict for permission type pair
          evidence[perm][t] = {}
    
          evidence[perm][t][reqUrl] = e
          evidenceKeyval.set(rootUrl, evidence)
        }
    
      }
      // we have don't have this rootUrl yet. So we init evidence at this url
      else {
        evidence[perm] = {}
        evidence[perm][t] = {}
        evidence[perm][t][reqUrl] = e
        evidenceKeyval.set(rootUrl, evidence)
      }
    }
  } )
}


export { addToEvidenceList }