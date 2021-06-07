import React, { useRef, useState } from "react"
import { SBadgeGroup, SBadge } from "./style"
import Evidence from "../evidence"
import { privacyLabels } from "../../../../background/analysis/classModels"
import { Collapse } from "bootstrap"

/**
 * Display of badges with sub types and collapse containing description and evidence
 */
const Item = ({ request, url, label }) => {
  const [evidence, setEvidence] = useState({ request: null, label: null, type: null })
  const collapseId = `${url}-${label}-collapse`
  const containerRef = useRef()

  /**
   * Show/hide collapse and populate with evidence data
   */
  const inflateCollapse = (event, request, type) => {

    setEvidence({ request: request, label: label, type: type })

    const target = event.target
    const collapse = new Collapse(document.getElementById(collapseId), {
      toggle: false,
    })

    if (document.getElementById(collapseId).classList.contains("show") && target.classList.contains("active")) {
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
          <SBadge key={type} className="badge" onClick={(event) => inflateCollapse(event, request, type)}>
            {privacyLabels[label]["types"][type]["displayName"]}
          </SBadge>
        ))}
      </SBadgeGroup>
      <Evidence request={evidence.request} collapseId={collapseId} label={evidence.label} type={evidence.type} />
    </>
  )
}

export default Item