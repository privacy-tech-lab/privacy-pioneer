import { getHostname } from "./util.js"
import { evidenceKeyval } from "./openDB.js"
import { Evidence } from "./classModels.js"

// given the permission category, the url of the request, and the snippet
// from the request, get the current time in ms and add to our evidence list
// async because it has to wait on get from db
//
//
/* So, now the evidence looks like this: 
 
  let stored = await evidenceKeyval.get(rootUrl)

  now stored points to the nested object with our evidence at this url
  There are three levels of nesting
  1) permission level
  2) type level
  3) reqUrl level

  The evidence object is in this final reqUrl level. 
  We store a max of 5 pieces of evidence for a given permission type pair.
}
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
    
    var rootUrl = getHostname(rootU)
    var reqUrl = getHostname(requestU)
  
    // hacky way to deal with the way we iterate through the disconnect json
    if (perm.includes("fingerprint")) { perm = "fingerprinting"}
    if (perm.includes("advertising")) { t = "analytics" }
    if (perm.includes("analytics")) { perm = "advertising" }
  
    // snippet = code snippet we identified as having sent personal data
    // typ = type of data identified
    // index = [start, end] indexes for snippet
    const e = new Evidence( {
      timestamp: ts,
      permission: perm,
      rootUrl: rootUrl,
      snippet: snip,
      requestUrl: requestU,
      typ: t,
      index: i
    } )
  
      // currently stored evidence at this domain
      var evidence = await evidenceKeyval.get(rootUrl)
  
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
          if ((Object.keys(evidence[perm][t]).length < 4) && !(reqUrl in evidence[perm][t] )) {
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

export { addToEvidenceList }