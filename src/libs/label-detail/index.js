import React from "react"
import { SBody, SContent, SDescription, SHeader, SSeperator, SSpacer, SThirdParty, STitle } from "./style"
import WebsiteLogo from "../website-logo"
import { AnimateSharedLayout, motion } from "framer-motion"
import Item from "./components/item"
import { SBadge, SBadgeGroup } from "./components/item/style"
import { privacyLabels } from "../../background/analysis/classModels"

const LabelDetail = ({ label, website, requests }) => {
  const urls = Object.keys(requests) // detected request urls containing identified data
  const collected = urls.includes(website) // Check if website collected data

  const firstParyDescription = () => {
    if (collected) {
      return `Collected the following ${label} data:`
    } else {
      return `Did not collect ${label} data.`
    }
  }

  const thirdPartyDescription = () => {
    if (collected && urls.length === 1) {
      return `${website} did not share ${label} data.`
    } else {
      return `${website} shared location data with the following third parties:`
    }
  }

  return (
    <SBody>
      <motion.div layout>
        <SHeader>
          <WebsiteLogo large domain={website} />
          <SSpacer />
          <SContent>
            <STitle>{website}</STitle>
            <SDescription>{firstParyDescription()} </SDescription>
            <SBadgeGroup>
              {collected ? Object.entries(requests[website]).map(([type, request]) => (
                <SBadge key={type}>{privacyLabels[label]["types"][type]["displayName"]}</SBadge>
              )) : null}
            </SBadgeGroup>
          </SContent>
        </SHeader>
        <SSeperator marginLeft="16px" marginRight="16px" />
      </motion.div>
      <SThirdParty>
        <STitle>Third Parties</STitle>
        <SDescription>{thirdPartyDescription()} </SDescription>
        <AnimateSharedLayout layout>
          {Object.entries(requests).map(([url, request]) => {
            if (url !== website) return <Item key={url} website={url} request={request} label={label} />
          })}
        </AnimateSharedLayout>
      </SThirdParty>
    </SBody>
  )
}

export default LabelDetail
