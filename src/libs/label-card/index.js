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
} from "./style"
import { privacyLabels } from "../../background/analysis/classModels"
import { CompanyLogo } from "../website-logo"
import { getParents } from "../indexed-db"
import { useHistory } from "react-router-dom"

/**
 * Card that briefly summarizes label and description for website
 */
const LabelCard = ({ requests, website, label, margin, onTap, popup }) => {
  const urls = Object.keys(requests) // detected request urls containing identified data
  const collected = urls.includes(website) // Check if website collected data
  const history = useHistory()

  /**
   * Get label description
   */
  const getDescription = () => {
    if (collected && urls.length > 1) {
      return (
        // `${website} collected and shared ${label} data with ${urls.length - 1}{" "}
        //   companies`
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <SBadge>Collected</SBadge>
          <SBadge>
            Shared with {urls.length - 1}
            {urls.length - 1 > 1 ? " sites" : " site"}
          </SBadge>
        </div>
      )
    } else if (collected) {
      // return `${website} collected ${label} data.`;
      return <SBadge>Collected</SBadge>
    } else {
      return (
        // `${website} shared ${label} data with ${urls.length} ${
        //   urls.length == 1 ? "company" : "companies"
        // }`;
        <SBadge>
          Shared with {urls.length} {urls.length > 1 ? "sites" : "site"}
        </SBadge>
      )
    }
  }

  /**
   * Get third party websites and render badges
   * Render max 2 badges
   */
  const getThirdParties = () => {
    let parentCompanies = getParents(requests)
    return (
      <>
        <SSeperator marginTop="16px" marginBottom="0px" />
        <SLogo>
          {parentCompanies.map((company) => (
            <CompanyLogo
              parent={company}
              key={company}
              margin={"8px 4px 0px 4px"}
            />
          ))}
        </SLogo>
      </>
    )
  }

  return (
    <SCard margin={margin} onClick={onTap} popup={popup}>
      <div>
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
      </div>
    </SCard>
  )
}

export default LabelCard
