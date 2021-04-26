import React, { useState } from "react"
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
import Evidence from "./components/evidence"
import { AnimateSharedLayout, motion } from "framer-motion"

const Item = (props) => {
  const [show, setVisibility] = useState(false)

  return (
    <SItem layout>
      <motion.div layout>
        <WebsiteBadge domain={props.domain} />
      </motion.div>
      <Evidence show={show} />
      <SSeperator marginTop="16px" />
    </SItem>
  )
}

const LabelDetail = (props) => {
  const keys = Object.keys(props.details)

  const firstParyDescription = () => {
    if (props.domain in props.details) {
      return `Collected ${props.label} data.`
    } else {
      return `Did not collect ${props.label} data.`
    }
  }

  const thirdPartyDescription = () => {
    if (props.domain in props.details && keys.length === 1) {
      return `${props.domain} did not share ${props.label} data.`
    } else {
      return `${props.domain} shared location data with the following third parties:`
    }
  }

  return (
    <SBody>
      <motion.div layout>
        <SHeader>
          <WebsiteLogo large domain={props.domain} />
          <SSpacer />
          <SContent>
            <STitle>{props.domain}</STitle>
            <SDescription>{firstParyDescription()} </SDescription>
          </SContent>
        </SHeader>
        <SSeperator marginLeft="16px" marginRight="16px" />
      </motion.div>
      <SThirdParty>
        <STitle>Third Parties</STitle>
        <SDescription>{thirdPartyDescription()} </SDescription>
        <AnimateSharedLayout layout>
          {Object.entries(props.details).map(([key, value]) => {
            if (key !== props.domain) return <Item key={key} domain={key} data={value} />
          })}
        </AnimateSharedLayout>
      </SThirdParty>
    </SBody>
  )
}

export default LabelDetail
