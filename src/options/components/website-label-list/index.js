/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react"
import WebsiteBadge from "../../../libs/components/website-badge"
import LabelCard from "../../../libs/components/label-card"
import { SContainer, SItem, SLabel, SLabelGroup, SSeperator } from "./style"
import { handleClick } from "../../../libs/indexed-db/getAnalytics"

/**
 * Makes label cards for a given website
 * @param {string} website the host website
 * @param {function} handleTap function that handles clicking on the cards
 * @param allLabels
 * @param webLabels
 */

const LabelCards = ({ website, handleTap, allLabels, webLabels }) => {
  return webLabels.map((label, index) => {
    var requests = "hide"
    if (Object.entries(allLabels).length == 0) {
      requests = "empty"
    } else {
      if (label in allLabels && website in allLabels[label]) {
        requests = allLabels[label][website]
      }
    }

    if (requests == "hide") {
      return null
    }

    return (
      <LabelCard
        key={index}
        onTap={() => {
          handleTap({ label, requests, website, show: true })
          handleClick('History Label Card (including Recents): ' + label.toString() + 'Website: ' + website.toString()) /* Label Card from History */
        }}
        margin="8px 16px 0px 0px"
        label={label}
        requests={requests}
        website={website}
      />
    )
  })
}

/**
 * Displays a list of websites and a quick summary of their privacy labels
 * @param {string} websites All websites we have evidence for
 * @param {int} maxLength
 * @param allLabels
 * @param webLabels
 */
const WebsiteLabelList = ({ websites, recent, handleTap, allLabels }) => {
  const entries = Object.entries(websites)
  return (
    <SContainer>
      {entries
        .slice(0, recent & (entries.length > 3) ? 3 : entries.length)
        .map(([website, data]) => (
          <SItem key={website}>
            <WebsiteBadge website={website} party={data.party} />
            <SLabelGroup>
              <LabelCards
                website={website}
                handleTap={handleTap}
                allLabels={allLabels}
                webLabels={data.labels}
              />
            </SLabelGroup>
            <SSeperator marginTop="16px" />
          </SItem>
        ))}
    </SContainer>
  )
}

export default WebsiteLabelList
