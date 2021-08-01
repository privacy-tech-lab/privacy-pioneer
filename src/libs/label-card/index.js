/*
Licensed per https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react"
import * as Icons from "../icons"
import {
  SCard,
  SDescription,
  SSeperator,
  SHeader,
  SHeaderLeading,
  SHeaderTitle,
  SHeaderTrailing,
  SMore,
  SLogo,
  SBadge,
  SContent,
} from "./style"
import { privacyLabels } from "../../background/analysis/classModels"
import WebsiteLogo, { CompanyLogo } from "../website-logo"
import { getParents } from "../company-icons/getCompany.js"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

/**
 * Card that briefly summarizes label and description for website
 */
const LabelCard = ({ requests, website, label, margin, onTap, popup }) => {
  const urls = Object.keys(requests) // detected request urls containing identified data
  const collected = urls.includes(website) // Check if website collected data

  /**
   * Label descriptions ({___} collected and shared {label}, collected, shared with {___})
   */
  const getDescription = () => {
    if (collected && urls.length > 1) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <SBadge>First Party</SBadge>
          <SBadge>
            {urls.length - 1}
            {urls.length - 1 > 1 ? " Third Parties" : " Third Party"}
          </SBadge>
        </div>
      )
    } else if (collected) {
      return <SBadge>First Party</SBadge>
    } else {
      return (
        <SBadge>
          {urls.length} {urls.length > 1 ? "Third Parties" : "Third Party"}
        </SBadge>
      )
    }
  }

  /**
   * Get third party websites and render badges
   * Render max 2 badges
   */
  const getThirdParties = () => {
    const More = ({ amount }) => {
      if (amount > 0) {
        return (
          <SMore>
            <Icons.Plus size={18} /> {amount}
            {" more"}
          </SMore>
        )
      } else return null
    }

    const ThirdPartyContent = () => {
      const websites = Object.keys(requests)
      const parents = getParents(requests)
      const companiesWithIcons = Object.keys(parents).filter(
        (company) => parents[company].hasIcon
      )

      if (companiesWithIcons.length >= 1) {
        companiesWithIcons.length =
          companiesWithIcons.length > 3 ? 3 : companiesWithIcons.length
        let numOfSitesWithIcons = 0
        companiesWithIcons.forEach((company) => {
          numOfSitesWithIcons += parents[company].websites.length
        })
        return (
          <SLogo>
            {companiesWithIcons.map((company) => {
              if (company)
                return (
                  <CompanyLogo
                    parent={company}
                    key={company}
                    margin={"0px 6px 0px 6px"}
                  />
                )
            })}
            <More amount={websites.length - numOfSitesWithIcons} />
          </SLogo>
        )
      } else
        return (
          <SLogo>
            {websites.map((website) => (
              <div data-custom data-custom-info={website}>
                <WebsiteLogo website={website} margin={"0px 6px 0px 6px"} />
              </div>
            ))}
            <More amount={websites.length - 1} />
          </SLogo>
        )
    }

    return (
      <>
        <SSeperator marginTop="16px" marginBottom="0px" />
        <ThirdPartyContent />
      </>
    )
  }

  return (
    <SCard margin={margin} onClick={onTap} popup={popup}>
      {requests == "empty" ? (
        <SkeletonTheme
          color="var(--cardColor)"
          highlightColor="var(--cardLoaderColor)"
        >
          <Skeleton height={"140px"} style={{ borderRadius: "16px" }} />
        </SkeletonTheme>
      ) : (
        <SContent>
          <SHeader>
            <SHeaderLeading>
              {Icons.getLabelIcon(label)}
              <SHeaderTitle>{privacyLabels[label]["displayName"]}</SHeaderTitle>
            </SHeaderLeading>
            <SHeaderTrailing>
              <Icons.ChevronRight size="24px" />
            </SHeaderTrailing>
          </SHeader>
          <SDescription>{getDescription()}</SDescription>
          {getThirdParties()}
        </SContent>
      )}
    </SCard>
  )
}

export default LabelCard
