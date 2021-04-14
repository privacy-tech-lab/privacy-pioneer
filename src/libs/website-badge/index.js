import React from "react"
import styled from "styled-components"
import WebsiteLogo from "../website-logo"

const SBadge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`

const WebsiteBadge = ({ domain }) => {
  return (
    <SBadge>
      <WebsiteLogo domain={domain} />
      <span style={{ marginLeft: "8px" }}>{domain}</span>
    </SBadge>
  )
}

export default WebsiteBadge
