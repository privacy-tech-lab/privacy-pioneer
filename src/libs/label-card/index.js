import React from "react"
import WebsiteBadge from "../website-badge"
import * as Icons from "../icons"
import { useHistory } from "react-router-dom"
import { SCard, SDescription, SSeperator, SHeader, SHeaderLeading, SHeaderTitle, SHeaderTrailing, SMore } from "./style"
import { privacyLabels } from "../../background/analysis/classModels"

const LabelCard = ({ requests, website, label, margin, onTap }) => {
  const history = useHistory()
  const urls = Object.keys(requests) // detected request urls containing identified data
  const collected = urls.includes(website) // Check if website collected data

  /**
   * Get label description
   */
  const getDescription = () => {
    if (collected && urls.length > 1) {
      return `${website} collected and shared ${label} data with the following companies:`
    } else if (collected) {
      return `${website} collected ${label} data.`
    } else {
      return `${website} shared ${label} data with the following companies:`
    }
  }

  /**
   * Get third party websites and render badges
   * Render max 2 badges
   */
  const getThirdParties = () => {
    if ((collected && urls.length > 1) || !collected) {
      const filtered = urls.filter((url) => url !== website)
      if (filtered.length > 2) {
        count = filtered.length - 2
        return (
          <>
            <SSeperator marginTop="16px" marginBottom="0px" />
            {filtered.slice(0, 2).map((url) => (
              <WebsiteBadge key={url} domain={url} />
            ))}
            <SMore>
              <Icons.PlusCircle size="24px" />
              <span style={{ marginLeft: "8px" }}>
                {count} {count > 1 ? "others" : "other"}
              </span>
            </SMore>
          </>
        )
      } else {
        return (
          <>
            <SSeperator marginTop="16px" marginBottom="0px" />
            {filtered.map((url) => (
              <WebsiteBadge key={url} domain={url} />
            ))}
          </>
        )
      }
    } else {
      return null
    }
  }

  return (
    <SCard
      margin={margin}
      onClick={onTap}
    >
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
    </SCard>
  )
}

export default LabelCard
