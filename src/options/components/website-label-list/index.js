import React from "react"
import WebsiteBadge from "../../../libs/website-badge"
import LabelCard from "../../../libs/label-card"
import { SContainer, SItem, SLabel, SLabelGroup, SSeperator } from "./style"

/**
 * Makes label cards for a given website
 */

const LabelCards = ({ website, handleTap, allLabels, webLabels }) => {
  return webLabels.map((label, index) => {
    const requests =
      Object.entries(allLabels).length > 0 ? allLabels[label][website] : "empty"
    return (
      <LabelCard
        key={index}
        onTap={() => {
          handleTap({ label, requests, website, show: true })
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
 */

const WebsiteLabelList = ({ websites, maxLength, handleTap, allLabels }) => {
  const entries = Object.entries(websites)
  return (
    <SContainer>
      {entries.slice(0, maxLength ?? entries.length).map(([website, data]) => (
        <SItem key={website}>
          <WebsiteBadge website={website} />
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
