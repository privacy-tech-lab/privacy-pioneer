/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import { getHostname } from "../utility/util.js"
import { evidenceKeyval } from "../interactDB/openDB.js"
import { Evidence, typeEnum, storeEnum } from "../classModels.js"
import { settingsKeyval } from "../../../libs/indexed-db/openDB.js";


/**
 * addToEvidenceList is the function that is called to populate the DB with a piece of evidence. Called by analyze.js when adding evidence.
 * The function is async because it makes calls to the DB and the browser history. Pieces of evidence are stored as
 * Evidence objects. These objects are stored at keys of their rootUrl. At each rootUrl, there is a dictionary with a permission level
 * (defined in permissionEnum) and then a further type level (defined in typeEnum). We store only one piece of evidence per permssion/type for a
 * given rootUrl and a maximum of 5 pieces of evidence in total for a permission/type.
 *
 * Defined in addEvidence.js
 * 
 * Used in analyze.js
 * 
 * @param {Object} evidenceToAdd Evidence that the function should add to the correct store in evidenceIDB
 * @param {boolean} firstParty Whether the evidence is a first party request
 * @param {string|undefined} parent Parent company of the request Url, if possible
 * @param {string} rootU The rootUrl of the request
 * @param {string} requestU The requestUrl of the request
 * @returns {Promise} Nothing. The evidence DB is updated.
 * 
 */

// perm, rootU, snip, requestU, t, i, extraDetail = undefined)
async function addToEvidenceStore(evidenceToAdd, firstParty, parent, rootU, requestU, saveFullSnippet) {

  /**
   * This is a known bug where certain websites intiate requests where the rootURL 
   * is undefined. rootURL comes from request.details["originUrl"] which is a property 
   * of the onBeforeRequest callback:
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#details
   * In this case, we do not add evidence and return.
   */
  if (rootU == undefined) { return new Promise( function(resolve, reject) {
    resolve('undefined rootU');
  }) }; 

  const ts = Date.now()
  const rootUrl = getHostname(rootU)
  const store = firstParty ? storeEnum.firstParty : storeEnum.thirdParty

  var evidence = await evidenceKeyval.get(rootUrl, store)
  if (evidence === undefined) { evidence = {} }

  /**
   * Unpacks and updates an evidence object to add to to our stores in evidenceIDB
   * 
   * Defined, used in addEvidence.js
   * 
   * @param {Object} evidenceListObject The evidence object to add
   * @returns {Void} updates the evidence object defined outside the function
   */
  function unpackAndUpdate(evidenceObject) {
    // if this is a valid object
    if (evidenceObject.rootUrl){
      evidenceObject.timestamp = ts
      evidenceObject.firstPartyRoot = firstParty
      evidenceObject.rootUrl = rootU
      evidenceObject.parentCompany = parent

    /**
     * Cuts down a snippet to only include the context of where we found
     * The evidence
     * 
     * @param {Evidence} evidenceObject 
     * @returns {void} updates evidenceObject
     */
    function cutDownSnippet(evidenceObject) {
      if ( evidenceObject.index === -1 ) {
        evidenceObject.snippet = null
      }
      else {
        let start, end
        [start, end] = evidenceObject.index
        const snipLength = evidenceObject.snippet.length

        const frontBuffer = start < 300 ? start : 300
        const endBuffer = end + 300 < snipLength ? 300 : snipLength - end - 1

        evidenceObject.snippet = evidenceObject.snippet.substring(start - frontBuffer, end + endBuffer)
        evidenceObject.index = [frontBuffer, frontBuffer + end - start]
      }
    }

    if (!saveFullSnippet){
      cutDownSnippet(evidenceObject)
    }

      // // whitelist our IP API
      // if (requestU == 'http://ip-api.com/json/'){ return new Promise( function(resolve, reject) {
      //   resolve('whitelist IP API');
      // }) };
      
      evidence = updateFetchedDict(evidence, evidenceObject)
    }
  }

  // update the fetched evidence dict with each piece of evidence we have for this request
  for ( const evidenceObj of evidenceToAdd) {
    unpackAndUpdate(evidenceObj)
    }

  //final return statement
  return new Promise( function(resolve, reject) {
    evidenceKeyval.set(rootUrl, evidence, store)
    resolve('set');
  });
}


/**
 * Function used to update an already fetched evidence dictionary with a piece of evidence, e.
 * 
 * Defined, used in addEvidence.js
 * 
 * @param {Dict} evidenceDict The dictionary we are updating 
 * @param {Evidence} e An evidence object
 * @returns {Dict} The param evidenceDict, but updated with Evidence, e, appropriately
 */
function updateFetchedDict(evidenceDict, e) {
    
  // vars from the evidence object we are adding
  var evidence = evidenceDict
  const reqUrl = getHostname(e.requestUrl)
  const perm = e.permission
  const t = e.typ

  // if we have this rootUrl in evidence already we check if we already have store_label
  if (Object.keys(evidence).length !== 0) {
    if (perm in evidence) {

      // if type is in the permission
      if (t in evidence[perm]) {
        let hardNo = reqUrl in evidence[perm][t]; //we have exactly this evidence already
        // if we have less than 5 different reqUrl's for this permission and this is a unique reqUrl, we save the evidence
        if ( !hardNo) {
          evidence[perm][t][reqUrl] = e
        }
        else { return evidence }
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
  return evidence
}

export { addToEvidenceStore }
