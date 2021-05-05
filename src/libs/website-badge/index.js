import React from "react"
import styled from "styled-components"
import WebsiteLogo from "../website-logo"

/**
 * Generally this would be in a style.js file
 * Since it belongs to such a simple component, it's here.
 */
const SBadge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`

/**
 * Displays website logo (which is the first letter of website) and title of website
 */
const WebsiteBadge = ({ website }) => {
  return (
    <SBadge>
      <WebsiteLogo website={website} />
      <span style={{ marginLeft: "8px" }}>{website}</span>
    </SBadge>
  )
}

export default WebsiteBadge
