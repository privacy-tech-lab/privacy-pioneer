import React from "react"
import WebsiteBadge from "../../../libs/website-badge"
import * as Icons from "../../../libs/icons"
import { useHistory } from "react-router-dom"
import { SContainer, SItem, SLabel, SLabelGroup, SSeperator } from "./style"
import { privacyLabels } from "../../../libs/constants"

const Item = (props) => {
  const history = useHistory()
  return (
    <SItem onClick={() => history.push({ pathname: `/website/${props.domain}` })}>
      <WebsiteBadge domain={props.domain} />
      <SLabelGroup>
        {Array.from(props.labels).map((label) => (
          <SLabel key={label}>
            {Icons.getLabelIcon(label)}
            {privacyLabels[label]["displayName"]}
          </SLabel>
        ))}
      </SLabelGroup>
      <SSeperator marginTop="16px" />
    </SItem>
  )
}

const WebsiteLabelList = (props) => {
  const entries = Object.entries(props.websites)
  return (
    <SContainer>
      {entries.slice(0, props.maxLength ?? entries.length).map(([key, value]) => (
        <Item key={key} domain={key} labels={value} />
      ))}
    </SContainer>
  )
}

export default WebsiteLabelList
