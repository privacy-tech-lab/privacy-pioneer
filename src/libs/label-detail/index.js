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

const Item = () => {
  const [show, setVisibility] = useState(false)

  return (
    <SItem layout>
      <motion.div layout>
        <WebsiteBadge domain={"Google"} />
        <SBadgeGroup>
          <SBadge selected={show} onClick={() => setVisibility((state) => !state)}>
            Coarse Location
          </SBadge>
          <SBadge>Approximate Location</SBadge>
        </SBadgeGroup>
      </motion.div>
      <Evidence show={show} />
      <SSeperator marginTop="16px" />
    </SItem>
  )
}

const LabelDetail = () => {
  return (
    <SBody>
      <motion.div layout>
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
      </motion.div>
      <SThirdParty>
        <STitle>Third Parties</STitle>
        <SDescription>Amazon shared your location data with the following third parties.</SDescription>
        <AnimateSharedLayout layout>
          <Item />
          <Item />
          <Item />
        </AnimateSharedLayout>
      </SThirdParty>
    </SBody>
  )
}

export default LabelDetail
