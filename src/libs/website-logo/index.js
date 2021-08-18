/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
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
  height: ${(props) => (props.large ? "64px" : "28px")};
  width: ${(props) => (props.large ? "64px" : "28px")};
  margin: ${(props) => (props.margin ? props.margin : "0px")};
  border-radius: 50%;
  background-color: ${(props) =>
    props.isLabel ? "none" : "var(--primaryHighlightColor)"};
  border: ${(props) =>
    props.isLabel ? "solid var(--primaryTextColor) 3px" : "none"};
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
  color: ${(props) =>
    props.isLabel ? "var(--primaryTextColor)" : "var(--tintTextColor)"};
  font-weight: 700;
  font-size: ${(props) => (props.large ? "32px" : "18px")};
`

/**
 * Displays website logo (which is the first letter of website)
 */
const WebsiteLogo = ({ website, large, margin, isLabel }) => {
  return (
    <SWebsiteLogo margin={margin} large={large} isLabel={isLabel}>
      <SLetterLogo large={large} isLabel={isLabel}>
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
        <Logo />
      </SCompanyLogo>
    )
  } else {
    return null
  }
}

export default WebsiteLogo
