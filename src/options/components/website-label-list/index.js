import React from "react"
import WebsiteBadge from "../../../libs/website-badge"
import * as Icons from "../../../libs/icons"
import { useHistory } from "react-router-dom"
import { SContainer, SItem, SLabel, SLabelGroup, SSeperator } from "./style"

const Item = () => {
  const history = useHistory()
  const onClick = (domain) => {
    history.push({ pathname: `/website/${domain}` })
  }

  return (
    <SItem onClick={() => onClick("www.amazon.com")}>
      <WebsiteBadge domain="chartboost.com" />
      <SLabelGroup>
        <SLabel>
          <Icons.Location size="24px" />
          Location
        </SLabel>
        <SLabel>
          <Icons.Location size="24px" />
          Location
        </SLabel>
      </SLabelGroup>
      <SSeperator marginTop="16px" />
    </SItem>
  )
}

const WebsiteLabelList = () => {
  return (
    <SContainer>
      <Item />
      <Item />
    </SContainer>
  )
}

export default WebsiteLabelList
