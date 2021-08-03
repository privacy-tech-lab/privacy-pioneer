/*
Licensed per https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react"
import styled from "styled-components"
import { CompanyLogoSVG } from "../company-icons"

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
  border-radius: 50%;
  background-color: ${(props) =>
    props.color ? props.color : "var(--primaryBrandTintColor)"};
`
const SCompanyLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.large ? "64px" : "24px")};
  width: ${(props) => (props.large ? "64px" : "24px")};
  margin: ${(props) => (props.margin ? props.margin : "0px")};
`

const SLetterLogo = styled.div`
  color: ${(props) => (props.color ? "white" : "var(--primaryBrandColor)")};
  font-weight: bold;
  font-size: ${(props) => (props.large ? "32px" : "16px")};
`

/**
 * Displays website logo (which is the first letter of website)
 */
const WebsiteLogo = ({ website, large, margin, color }) => {
  return (
    <SWebsiteLogo margin={margin} large={large} color={color}>
      <SLetterLogo large={large} color={color}>
        {website.charAt(0).toUpperCase()}
      </SLetterLogo>
    </SWebsiteLogo>
  )
}

export const CompanyLogo = ({ parent, large, margin }) => {
  const Logo = CompanyLogoSVG[parent]
  if (Logo) {
    return (
      <SCompanyLogo margin={margin} large={large}>
        {" "}
        <Logo size={"24px"} />
      </SCompanyLogo>
    )
  } else {
    return null
  }
}

export default WebsiteLogo
