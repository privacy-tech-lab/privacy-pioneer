import React from "react"
import {
  SBadge,
  SBadgeGroup,
  SBody,
  SContent,
  SDescription,
  SHeader,
  SItem,
  SSeperator,
  SSpacer,
  SThirdParty,
  STitle,
} from "./style"
import WebsiteLogo from "../website-logo"
import WebsiteBadge from "../website-badge"

const LabelDetail = () => {
  return (
    <SBody>
      <SHeader>
        <WebsiteLogo large domain={"Amazon"} />
        <SSpacer />
        <SContent>
          <STitle>Amazon</STitle>
          <SDescription>Collects the following location data:</SDescription>
          <SBadgeGroup>
            <SBadge>Coarse Location</SBadge>
          </SBadgeGroup>
        </SContent>
      </SHeader>
      <SSeperator marginLeft="16px" marginRight="16px" />
      <SThirdParty>
        <STitle>Third Parties</STitle>
        <SDescription>Amazon shared your location data with the following third parties.</SDescription>
        <SItem>
          <WebsiteBadge domain={"Google"} />
          <SBadgeGroup>
            <SBadge>Coarse Location</SBadge>
            <SBadge>Approximate Location</SBadge>
          </SBadgeGroup>
          <SSeperator marginTop="16px" />
        </SItem>
        <SItem>
          <WebsiteBadge domain={"Spotify"} />
          <SBadgeGroup>
            <SBadge>Coarse Location</SBadge>
            <SBadge>Approximate Location</SBadge>
          </SBadgeGroup>
          <SSeperator marginTop="16px" />
        </SItem>
        <SItem>
          <WebsiteBadge domain={"Facebook"} />
          <SBadgeGroup>
            <SBadge>Coarse Location</SBadge>
            <SBadge>Approximate Location</SBadge>
          </SBadgeGroup>
          <SSeperator marginTop="16px" />
        </SItem>
      </SThirdParty>
    </SBody>
  )
}

export default LabelDetail
