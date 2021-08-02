/*
Licensed per https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react";
import styled from "styled-components";
import { getParent, getParents } from "../company-icons/getCompany.js";
import WebsiteLogo, { CompanyLogo } from "../website-logo";

const exSites = require('../../assets/exampleData.json').exModels

/**
 * Generally this would be in a style.js file
 * Since it belongs to such a simple component, it's here.
 */
const SBadge = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

/**
 * Example data styling
 */
const SExample = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  padding: 2px 4px;
  border-radius: 8px;
  background-color: var(--primaryHighlightColor);
  color: var(--tintTextColor);
`;

/**
 * Displays website logo (which is the first letter of website) and title of website
 * @param {string} website the host website
 * @param {string|null} showParent the parent company of the site
 */
const WebsiteBadge = ({ website, showParent }) => {
  if ([exSites.invasive_site, exSites.get_location].includes(website)){
    var exampleSite = true
  }
  const parent = getParent(website);
  const logo = parent ? <CompanyLogo parent={parent} /> : null;
  return (
    <SBadge>
      <span style={{ display: "flex" }}>
        <WebsiteLogo website={website} />
        <span
          style={{
            marginLeft: "8px",
            marginRight: "16px",
            fontSize: "18px",
            justifyContent: "flex-start",
          }}
        >
          {website}
        </span>
        {exampleSite ? <SExample>Example Data</SExample> : null}
      </span>
      {showParent ? logo : null}
    </SBadge>
  );
};

export default WebsiteBadge;
