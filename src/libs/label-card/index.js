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
import { getParents } from "../company-icons/getCompany.js"
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
          <SBadge>First Party</SBadge>
          <SBadge>
            {urls.length - 1}
            {urls.length - 1 > 1 ? " Thrid Parties" : " Thrid Party"}
          </SBadge>
        </div>
      )
    } else if (collected) {
      // return `${website} collected ${label} data.`;
      return <SBadge>First Party</SBadge>
    } else {
      return (
        // `${website} shared ${label} data with ${urls.length} ${
        //   urls.length == 1 ? "company" : "companies"
        // }`;
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
    const websites = Object.keys(requests)
    const parents = getParents(requests)
    const parentCompanies = parents.companies
    const sitesWithParents = parents.includedSites
    const parentIcons = parentCompanies.map((company) => (
      <CompanyLogo parent={company} key={company} margin={"0px 4px 0px 4px"} />
    ))
    console.log(parentIcons)

    const Content = () => {
      if (parentIcons.length >= 1 && parentIcons != [null]) {
        return sitesWithParents.length == websites.length ? (
          <SLogo>{parentIcons}</SLogo>
        ) : (
          <SLogo>
            {parentIcons}{" "}
            <SMore>
              <Icons.Plus size={18} /> {websites.length - parentIcons.length}
              {" more"}
            </SMore>
          </SLogo>
        )
      } else if (parentCompanies.length > 0 && parentIcons.length == 0) {
        return (
          <SLogo>
            {parentCompanies[0]}
            <SMore>
              <Icons.Plus size={18} />{" "}
              {websites.length - parentCompanies.length}
              {" more"}
            </SMore>
          </SLogo>
        )
      } else
        return (
          <SLogo>
            {websites[0]}
            <SMore>
              <Icons.Plus size={18} /> {websites.length - 1}
              {" more"}
            </SMore>
          </SLogo>
        )
    }
    return (
      <>
        <SSeperator marginTop="16px" marginBottom="0px" />

        <Content />
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
