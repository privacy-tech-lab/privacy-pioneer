/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React from "react";
import {
  SBody,
  SContent,
  SDescription,
  SHeader,
  SItem,
  SSeperator,
  SSpacer,
  SThirdParty,
  STitle,
  SHeaderBadge,
} from "./style";
import WebsiteBadge from "../website-badge";
import Item from "./components/item";

/**
 * Detailed view of label and third parties
 * @param {string} label associated label
 * @param {string} website websites we are looking at
 * @param {Array<object>} requests evidence objects we created
 */
const LabelDetail = ({ label, website, requests }) => {
  const urls = Object.keys(requests); // detected request urls containing identified data
  const collected = urls.includes(website); // Check if website collected data

  /**
   * Get first party description based on whether 'website' collected data
   */
  const firstPartyDescription = () => {
    if (collected && urls.length === 1) {
      return `${website} collected the following ${label} data:`;
    }
    else if (collected && urls.length > 1) {
      return `${website} collected and shared the following ${label} data:`;
    }
    else if (!collected && urls.length > 1) { 
      return `${website} shared the following ${label} data:`;
    }
    else {
      return `Did not collect or share ${label} data.`;
    }
  };


  return (
    <SBody>
      <SHeader>
        <SHeaderBadge>
          <WebsiteBadge website={website} showParent />
        </SHeaderBadge>
        <SSpacer />
        <SContent>
          <SDescription>{firstPartyDescription()} </SDescription>
          {collected ? (
            <Item url={website} request={requests[website]} label={label} />
          ) : null}
        </SContent>
      </SHeader>
      <SThirdParty>
        <STitle>Third Parties</STitle>
        {Object.entries(requests).map(([url, request]) => {
          if (url !== website)
            return (
              <SItem key={url}>
                <WebsiteBadge website={url} showParent />
                <Item url={url} request={request} label={label} />
                <SSeperator marginTop="16px" />
              </SItem>
            );
        })}
      </SThirdParty>
    </SBody>
  );
};

export default LabelDetail;
