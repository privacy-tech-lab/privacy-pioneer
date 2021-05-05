import React from "react"
import WebsiteBadge from "../../../libs/website-badge"
import * as Icons from "../../../libs/icons"
import { useHistory } from "react-router-dom"
import { SContainer, SItem, SLabel, SLabelGroup, SSeperator } from "./style"
import { privacyLabels } from "../../../background/analysis/classModels"

/**
 * Displays a list of websites and a quick summary of their privacy labels
 */
const WebsiteLabelList = ({ websites, maxLength }) => {
  const history = useHistory()
  const entries = Object.entries(websites)
  return (
    <SContainer>
      {entries.slice(0, maxLength ?? entries.length).map(([website, labels]) => (
        <SItem key={website} onClick={() => history.push({ pathname: `/website/${website}` })}>
          <WebsiteBadge website={website} />
          <SLabelGroup>
            {Array.from(labels).map((label) => (
              <SLabel key={label}>
                {Icons.getLabelIcon(label)}
                {privacyLabels[label]["displayName"]}
              </SLabel>
            ))}
          </SLabelGroup>
          <SSeperator marginTop="16px" />
        </SItem>
      ))}
    </SContainer>
  )
}

export default WebsiteLabelList
