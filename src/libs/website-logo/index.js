import React from "react";
import styled, { css } from "styled-components";
import { CompanyLogoSVG, Twitter } from "../company-icons";
import * as parentCompanies from "../../assets/parents.json";

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
`;

const SLetterLogo = styled.div`
  color: var(--primaryBrandColor);
  font-weight: bold;
  font-size: ${(props) => (props.large ? "32px" : "16px")};
`;

const companyDict = Object.keys(parentCompanies)
  .map((type) => parentCompanies[type])
  .slice(1, 3);

/**
 * Displays website logo (which is the first letter of website)
 */
const WebsiteLogo = ({ website, large, margin }) => {
  return (
    <SWebsiteLogo margin={margin} large={large} letter>
      <SLetterLogo>{website.charAt(0).toUpperCase()}</SLetterLogo>
    </SWebsiteLogo>
  );
};

export const CompanyLogo = ({ parent, large, margin }) => {
  const Logo = CompanyLogoSVG[parent];
  return (
    <SWebsiteLogo margin={margin} large={large} letter={Logo == null}>
      {Logo ? (
        <Logo size={"24px"} />
      ) : (
        <SLetterLogo>{parent.charAt(0).toUpperCase()}</SLetterLogo>
      )}
    </SWebsiteLogo>
  );
};

export default WebsiteLogo;
