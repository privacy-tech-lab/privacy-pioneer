import React from "react"
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
} from "./style"
import WebsiteLogo from "../website-logo"
import WebsiteBadge from "../website-badge"
import Item from "./components/item"

/**
 * Detailed view of label and third parties
 */
const LabelDetail = ({ label, website, requests }) => {
  const urls = Object.keys(requests) // detected request urls containing identified data
  const collected = urls.includes(website) // Check if website collected data

  /**
   * Get first party description based on whether 'website' collected data
   */
  const firstPartyDescription = () => {
    if (collected) {
      return `Collected the following ${label} data:`
    } else {
      return `Did not collect ${label} data.`
    }
  }

  /**
   * Get third party description based on whether 'website' shared data
   */
  const thirdPartyDescription = () => {
    if (collected && urls.length === 1) {
      return `${website} did not share ${label} data.`
    } else {
      return `${website} shared ${label} data with the following third parties:`
    }
  }

  return (
    <SBody>
      <SHeader>
        <SHeaderBadge>
          <WebsiteLogo website={website} />
          <STitle style={{ marginLeft: "8px" }}>{website}</STitle>
        </SHeaderBadge>
        <SSpacer />
        <SContent>
          <SDescription>{firstPartyDescription()} </SDescription>
          {collected ? <Item url={website} request={requests[website]} label={label} /> : null}
        </SContent>
      </SHeader>
      <SSeperator marginLeft="16px" marginRight="16px" />
      <SThirdParty>
        <STitle>Third Parties</STitle>
        <SDescription>{thirdPartyDescription()} </SDescription>
        {Object.entries(requests).map(([url, request]) => {
          if (url !== website)
            return (
              <SItem key={url}>
                <WebsiteBadge website={url} />
                <Item url={url} request={request} label={label} />
                <SSeperator marginTop="16px" />
              </SItem>
            )
        })}
      </SThirdParty>
    </SBody>
  )
}

export default LabelDetail
