/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState } from "react"
import { privacyLabels } from "../../../../background/analysis/classModels"
import { SContainer, SHeader, SCollapse, SCodeBlock, SBody, SBodyMod, SEvidenceDescription } from "./style"

/**
 * 'Collapse' containing evidence/extra info about identified label type
 * 
 * @param collapseId id of label to be collapsed
 * @param request our evidence object for this request
 * @param label Label we have attributed to the http request
 * @param type type of label
 */
const Evidence = ({ collapseId, request, label, type }) => {
  /**
   * Check if value is int
   */
  const isInt = (value) => {
    var x
    if (isNaN(value)) {
      return false
    }
    x = parseFloat(value)
    return (x | 0) === x
  }

  /**
   * Get the identified evidence code snippet
   * @param {object} request our evidence object for this request
   * @returns {object} sliced snippet | null
   */
  const getSnippet = (request) => {
    if (
      request != null &&
      request.snippet != null &&
      request.index !== -1 &&
      isInt(request.index[0]) &&
      isInt(request.index[1])
    ) {
      const data = { leading: "", middle: "", trailing: "" }
      data.leading = request.snippet.slice(0, request.index[0])
      data.middle = request.snippet.slice(request.index[0], request.index[1])
      data.trailing = request.snippet.slice(request.index[1], request.snippet.length)
      if (!request.cookie) {
        const maxChars = 475
        data.leading = "... " + data.leading.slice(maxChars * -1)
        data.trailing = data.trailing.slice(0, maxChars) + " ..."
      }
      return data
    } else {
      return null
    }
  }

  /**
   * Get sub label general description
   * @param {object} request our evidence object for this request
   * @returns {object} sliced general description of our reasonings for our labels | ""
   */
  const getGeneralDescription = (request) => {
    if (request != null) {
      let generalDescriptionParsed = {leading: "", highlight: "", trailing: ""};
      const displayType = privacyLabels[label]["types"][type]["displayName"];
      const generalDescription = privacyLabels[label]["types"][type]["description"];

      // we want to highlight the label type in the description
      let highlight = generalDescription.indexOf(displayType);
      if (displayType == "Encoded Email") {
        generalDescriptionParsed.leading = "‣ ".concat(generalDescription.slice(0,3));
        generalDescriptionParsed.highlight = "Email Address";
        generalDescriptionParsed.trailing = generalDescription.slice(16, generalDescription.length)
      }
      else if (highlight == -1) {
        generalDescriptionParsed.leading = "‣ ".concat(generalDescription);
      }
      else {
        generalDescriptionParsed.leading = "‣ ".concat(generalDescription.slice(0, highlight));
        generalDescriptionParsed.highlight = displayType;
        generalDescriptionParsed.trailing = generalDescription.slice(highlight + displayType.length, generalDescription.length);
      }
      return generalDescriptionParsed;
    }
    return ""
  }

  const [handEmoji, setHandEmoji] = useState('');

  useEffect(() => {
    let choice = pickPointRightEmoji();
    setHandEmoji(choice);
  }, []);

  /**
   * return a random hand from choice of all hands
   * @returns {string}
   */
  const pickPointRightEmoji = () => {
    const allHands = [`👉`, `👉🏻`, `👉🏼`, `👉🏽`, `👉🏾`, `👉🏿`];
    return allHands[Math.floor(Math.random()*allHands.length)];
  }

  /**
   * Get sub label specific description
   * @param {object} request our evidence object for this request
   * @returns {object} sliced specific description of our reasonings for our labels | ""
   */
  const getSpecificDescription = (request) => {
    if (request != null) {
      let specificDescription = {leading: "", highlight: "", trailing: "", email: "", trail1: "", encodedEmail: "", trail2: "", signOff: "", link: "", linkDesc: ""};

      // populate description aspects that are the same regardless of other properties
      const displayType = privacyLabels[label]["types"][type]["displayName"];
      const displayLink = privacyLabels[label]["types"][type]["link"];

      if (displayLink) {
        specificDescription.link = displayLink
        // 26 is the length where the text will fit in one line
        const cutOff = specificDescription.link.length < 26 ? specificDescription.link.length : 26
        specificDescription.linkDesc = (specificDescription.link).substring(0, cutOff).concat('...')
        specificDescription.signOff = `More info ${handEmoji}`
      }

      // description for when evidence came from a list of URL's (disconnect or urlClassification header)
      if (request.index == -1) {
        specificDescription.leading = `‣ The URL that initiated this HTTP request is known to practice `;
        specificDescription.highlight = `${displayType}`;
        specificDescription.trailing = `.`;
      }

      // description for when the evidence came with an index in the strReq
      // (this could mean body but could also be a requeust URL that came up from one of the search routines)
      else {
        let keywordFlagged = request.snippet.slice(request.index[0], request.index[1]);
        // cut down the keyword if it's lengthy.
        if (keywordFlagged.length > 25) {
          let trailingPeriods = keywordFlagged.charAt(24) == `.` ? `..` : `...`; // to avoid ....
          keywordFlagged = keywordFlagged.slice(0,25).concat(trailingPeriods);
        }
        specificDescription.leading = `‣ We found`;
        specificDescription.highlight = ` ${keywordFlagged}`;

        // general case
        if (request.extraDetail == undefined){
          specificDescription.trailing =  ` in this HTTP request, so we gave it the ${displayType} label.`;
        }
        // specific encoded email case
        else {
          specificDescription.trailing =  ` in this HTTP request, which is the encoded form of `;
          specificDescription.email = `${request.extraDetail}`;
          specificDescription.trail1 = ` from your watchlist, so we gave it the `
          specificDescription.encodedEmail = `${displayType}`
          specificDescription.trail2 = ` label.`;
        }
      }
      return specificDescription
    }
    return ""
  }

  const specificDescription = getSpecificDescription(request);
  const generalDescription = getGeneralDescription(request);
  const data = getSnippet(request);

  return (
    <SCollapse className="collapse" id={collapseId}>
      <SContainer className="card card-body">
        <SHeader marginTop="16px">◉ Description</SHeader>
            <SEvidenceDescription>
              <pre>
              {generalDescription.leading}
              <span>{generalDescription.highlight}</span>
              {generalDescription.trailing}
              <br></br>
              {specificDescription.leading}
              <span>{specificDescription.highlight}</span>
              {specificDescription.trailing}
              <span>{specificDescription.email}</span>
              {specificDescription.trail1}
              <span>{specificDescription.encodedEmail}</span>
              {specificDescription.trail2}
              {request != null && request.cookie?
                <div>
                  {"‣ This information was stored in a cookie."}
                </div>
              :<br></br>}
              <br></br>
              <span>
                {specificDescription.signOff} <a target="_blank" href={specificDescription.link}>{specificDescription.linkDesc}</a>
              </span>
              </pre>
            </SEvidenceDescription>
        <SHeader marginTop="16px">◉ Request URL </SHeader>
        {data ?
          <div>
            <SBody>
              <pre>
                <code>{request != null ? request["requestUrl"] : ""}&nbsp;</code>
              </pre>
            </SBody>
            <SHeader marginTop="16px" marginBottom="8px">
              ◉ Data Context
            </SHeader>
            <SCodeBlock>
              <pre>
                <code>
                  {data.leading}
                  <span>{data.middle}</span>
                  {data.trailing}
                </code>
              </pre>
            </SCodeBlock>
          </div> 
        : <SBodyMod>
            <pre>
              <code>
                {request != null ? request["requestUrl"] : ""}&nbsp;
              </code>
            </pre>
          </SBodyMod>
        } 
      </SContainer>
    </SCollapse>
  )
}
 
export default Evidence
