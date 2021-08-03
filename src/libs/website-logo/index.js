/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react"
import styled, { css } from "styled-components"
import { CompanyLogoSVG, Twitter } from "../company-icons"

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
  margin: ${(props) => (props.margin ? props.margin : "0px")};
  border-radius: ${(props) => (props.letter ? "50%" : "0px")};
  background-color: ${(props) =>
    props.letter ? "var(--primaryBrandTintColor)" : "none"};
`

const SLetterLogo = styled.div`
  color: var(--primaryBrandColor);
  font-weight: bold;
  font-size: ${(props) => (props.large ? "32px" : "16px")};
`

/**
 * Displays website logo (which is the first letter of website)
 */
const WebsiteLogo = ({ website, large, margin }) => {
  return (
    <SWebsiteLogo margin={margin} large={large} letter>
      <SLetterLogo large={large}>{website.charAt(0).toUpperCase()}</SLetterLogo>
    </SWebsiteLogo>
  )
}

export const CompanyLogo = ({ parent, large, margin }) => {
  const Logo = CompanyLogoSVG[parent]
  if (Logo) {
    return (
      <SWebsiteLogo margin={margin} large={large}>
        {" "}
        <Logo size={"24px"} />
      </SWebsiteLogo>
    )
  } else {
    return null
  }
}

export default WebsiteLogo
