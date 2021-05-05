import React, { useState } from "react"
import { motion } from "framer-motion"
import WebsiteBadge from "../../../website-badge"
import { SBadgeGroup, SItem, SSeperator, SBadge } from "./style"
import Evidence from "../evidence"
import { privacyLabels } from "../../../../background/analysis/classModels"

/**
 * Third party website with label types displayed in detailed label view
 */
const Item = ({ website, request, label }) => {
  const [show, setVisibility] = useState(false)

  return (
    <SItem layout>
      <motion.div layout>
        <WebsiteBadge website={website} />
        <SBadgeGroup>
          {Object.entries(request).map(([type, request]) => (
            <SBadge key={type} selected={show} onClick={() => /*setVisibility((state) => !state)*/ console.log(request)}>
              {privacyLabels[label]["types"][type]["displayName"]}
            </SBadge>
          ))}
        </SBadgeGroup>
      </motion.div>
      <Evidence show={show} />
      <SSeperator marginTop="16px" />
    </SItem>
  )
}

export default Item
