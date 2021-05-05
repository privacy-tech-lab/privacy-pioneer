import React from "react"
import styled from "styled-components"

/**
 * Generally this would be in a style.js file
 * Since it belongs to such a simple component, it's here.
 */
const SWebsiteLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.large ? "64px" : "24px")};
  width: ${(props) => (props.large ? "64px" : "24px")};
  border-radius: 50%;
  background-color: var(--primaryBrandTintColor);
  color: var(--primaryBrandColor);
  font-weight: bold;
  font-size: ${(props) => (props.large ? "32px" : "12px")};
  margin: ${(props) => (props.margin ? props.margin : "0px")};
`

/**
 * Displays website logo (which is the first letter of website)
 */
const WebsiteLogo = ({ website, large, margin }) => {
  return (
    <SWebsiteLogo margin={margin} large={large}>
      {website.charAt(0).toUpperCase()}
    </SWebsiteLogo>
  )
}

export default WebsiteLogo
