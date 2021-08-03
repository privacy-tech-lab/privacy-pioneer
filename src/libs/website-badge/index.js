/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react";
import styled from "styled-components";
import { getParent, getParents } from "../company-icons/getCompany.js";
import WebsiteLogo, { CompanyLogo } from "../website-logo";

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
 * Displays website logo (which is the first letter of website) and title of website
 * @param {string} website the host website
 * @param {string|null} showParent the parent company of the site
 */
const WebsiteBadge = ({ website, showParent }) => {
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
      </span>
      {showParent ? logo : null}
    </SBadge>
  );
};

export default WebsiteBadge;
