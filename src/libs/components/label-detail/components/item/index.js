/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useRef, useState } from "react"
import { SBadgeGroup, SBadge } from "./style"
import Evidence from "../evidence"
import { Collapse } from "bootstrap"
import { privacyLabels } from "../../../../../background/analysis/classModels"
import { handleClick } from "../../../../indexed-db/getAnalytics"

/**
 * Display of badges with sub types and collapse containing description and evidence
 * @param {object} request our evidence object for this request
 * @param {string} url the request url
 * @param {string} label the associated label of this evidence
 */
const Item = ({ request, url, label }) => {
  const [evidence, setEvidence] = useState({
    request: null,
    label: null,
    type: null,
  })
  const collapseId = `${url}-${label}-collapse`
  const containerRef = useRef()

  /**
   * Show/hide collapse and populate with evidence data
   * @param {event} event onClick event of the badge
   * @param {object} request our evidence object for this request
   * @param {string} type The type of evidence
   */
  const inflateCollapse = (event, request, type) => {
    setEvidence({ request: request, label: label, type: type })

    const target = event.target
    const collapse = new Collapse(document.getElementById(collapseId), {
      toggle: false,
    })

    if (
      document.getElementById(collapseId).classList.contains("show") &&
      target.classList.contains("active")
    ) {
      const matches = containerRef.current.querySelectorAll(".badge")
      matches.forEach(function (match) {
        match.classList.remove("active")
      })
      collapse.hide()
    } else {
      const matches = containerRef.current.querySelectorAll(".badge")
      matches.forEach(function (match) {
        match.classList.remove("active")
      })
      target.classList.add("active")
      collapse.show()
    }
  }

  return (
    <>
      <SBadgeGroup ref={containerRef}>
        {Object.entries(request).map(([type, request]) => (
          <SBadge
            key={type}
            className="badge"
            onClick={(event) => {
              inflateCollapse(event, request, type)
              handleClick('Description Button (ip adress, zip code) etc [Works for All]')}}
          >
            {privacyLabels[label]["types"][type]["displayName"]}
            {request.cookie ? ` 🍪` : null}
          </SBadge>
        ))}
      </SBadgeGroup>
      <Evidence
        request={evidence.request}
        collapseId={collapseId}
        label={evidence.label}
        type={evidence.type}
      />
    </>
  )
}

export default Item
