import { getHostname } from "./util.js"
import { evidenceKeyval } from "./openDB.js"
import { Evidence, typeEnum, storeEnum } from "./classModels.js"
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
 * @returns {Promise} Nothing. The evidence DB is updated.
 *
 * addToEvidenceList is the function that is called to populate the DB with a piece of evidence. Called by the functions in
 * searchFuncitons.js. The function is async because it makes calls to the DB and the browser history. Pieces of evidence are stored as
 * Evidence objects. These objects are stored at keys of their rootUrl. At each rootUrl, there is a dictionary with a permission level
 * (defined in permissionEnum) and then a further type level (defined in typeEnum). We store only one piece of evidence per permssion/type for a
 * given rootUrl and a maximum of 5 pieces of evidence in total for a permission/type.
 */
async function addToEvidenceList(perm, rootU, snip, requestU, t, i) {

  // We do not want calls to the api we use for getting a user's IP to show up in evidence. Whitelist this domain.
  if (requestU == 'http://ip-api.com/json/'){return;}

  var ts = Date.now()

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
  historyQuery.then( async (queryData) => {

    let isFirstParty = firstPartyCheck(queryData)
    let requestParent = getParent(reqUrl)
    await setEvidence(isFirstParty, requestParent)
    return

    /**
     * Takes the parameters from the outer addToEvidenceList function, queries what's currently in the database at
     * the given rootUrl and updates the DB accordingly.
     *
     * @param {boolean} firstParty Whether or not the evidence has a rootUrl that the user visited
     * @param {string} requestParent Parent company of site making the request, if possible
     * @returns {Promise} Nothing. Populates the DB with the new evidence.
     *
     */
    async function setEvidence(firstParty, requestParent) {

      const store = firstParty == true ? storeEnum.firstParty : storeEnum.thirdParty;

      var evidence = await evidenceKeyval.get(rootUrl, store)

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

      /**
      * Used to push evidence through (override evidence cap of 4 per type)
      * that will create multiple labels for one request URL
      *
      * @param {Object} currDict object with the dexisting evidence for a permission
      * @param {string} typ the type that we're currently trying to add
      * @returns {Set} The urls that already have evidence within this permission
      */
      function getReqUrlsWithDifferentTypes(currDict, typ) {

        var reqUrlSet = new Set()

        for ( const [type, reqUrlObject] of Object.entries(currDict) ) {
          for ( const reqUrl of Object.keys(reqUrlObject)) {
            if (typ != type) { reqUrlSet.add(reqUrl) }
          }
        }
        return reqUrlSet
      }

      // if we have this rootUrl in evidence already we check if we already have store_label
      if (Object.keys(evidence).length !== 0) {
        if (perm in evidence) {
          var pushThrough = false
          let reqUrlSet = getReqUrlsWithDifferentTypes(evidence[perm], t)
          if (reqUrlSet.has(reqUrl)) { pushThrough = true; }

          // if type is in the permission
          if (t in evidence[perm]) {
            let hardNo = reqUrl in evidence[perm][t];
            let belowEvidenceCap = (Object.keys(evidence[perm][t]).length < 5)
            // if we have less than 5 different reqUrl's for this permission and this is a unique reqUrl, we save the evidence
            if ( (pushThrough || (belowEvidenceCap)) && !hardNo) {
              evidence[perm][t][reqUrl] = e
            }
            else { return }
          }
          else { // we don't have this type yet, so we initialize it
            evidence[perm][t] = {}
            evidence[perm][t][reqUrl] = e
          }
        }
        else { // we don't have this permission yet so we initialize
          evidence[perm] = {}

          // init dict for permission type pair
          evidence[perm][t] = {}

          evidence[perm][t][reqUrl] = e
        }

      }
      // we have don't have this rootUrl yet. So we init evidence at this url
      else {
        evidence[perm] = {}
        evidence[perm][t] = {}
        evidence[perm][t][reqUrl] = e
      }
      evidenceKeyval.set(rootUrl, evidence, store);
    }
  } )
}


export { addToEvidenceList }
