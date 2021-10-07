/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useRef, useState } from "react"
import {
  permissionEnum,
  timeRangeEnum,
} from "../../../../../background/analysis/classModels"
import * as Icons from "../../../../../libs/icons"
import { ToggleSwitch } from "../toggle-switch"
import {
  getLabelStatus,
  getSnippetStatus,
  getOptimizationStatus,
  toggleLabel,
  toggleSnippet,
  toggleOptimization,
} from "../../../../../libs/indexed-db/settings"
import {
  SExportButton,
  SExportSection,
  SLabelToggle,
  SDropdown,
  SDropdownItem,
  SDropdownOptions,
  SDropdownSelection,
  SSnippetToggle,
} from "./style"
import { initiateDownload } from "../../../../../libs/exportData/initiateDownload"
import { exportTypeEnum } from "../../../../../background/analysis/classModels.js"

export const FullSnippetToggle = () => {
  const [snippetStatus, setSnippetStatus] = useState(false)

  useEffect(() => {
    getSnippetStatus().then((res) => {
      setSnippetStatus(res)
    })
  })

  const toggle = () => {
    toggleSnippet()
    setSnippetStatus(!snippetStatus)
  }

  return (
    <SSnippetToggle>
      <ToggleSwitch
        isActive={snippetStatus}
        onClick={() => toggle()}
        label={"Save Full HTTP Requests"}
        spaceBetween
      />
    </SSnippetToggle>
  )
}

export const OptimizationToggle = () => {
  const [optimizationStatus, setOptimizationStatus] = useState(true)

  useEffect(() => {
    getOptimizationStatus().then((res) => {
      setOptimizationStatus(res)
    })
  })

  const toggleOptimize = () => {
    toggleOptimization()
    setOptimizationStatus(!optimizationStatus)
  }

  return (
    <SSnippetToggle>
      <ToggleSwitch
        isActive={optimizationStatus}
        onClick={() => toggleOptimize()}
        label={"Optimize Performance"}
        spaceBetween
      />
    </SSnippetToggle>
  )
}

export const LabelToggle = () => {
  const [labelStatus, SetLabelStatus] = useState({
    [permissionEnum.location]: true,
    [permissionEnum.monetization]: true,
    [permissionEnum.watchlist]: true,
    [permissionEnum.tracking]: true,
  })

  useEffect(() => {
    let componentMounted = true

    getLabelStatus().then((res) => {
      if (componentMounted) SetLabelStatus(res)
    })
    return () => {
      componentMounted = false
    }
  }, [labelStatus])

  const toggle = (label) => {
    toggleLabel(label)
    const newLabelStatus = labelStatus
    let previousStatus = newLabelStatus[label]
    newLabelStatus[label] = !previousStatus
    SetLabelStatus(newLabelStatus)
  }

  return (
    <SLabelToggle>
      {Object.values(permissionEnum).map((label) => (
        <ToggleSwitch
          isActive={labelStatus[label]}
          onClick={() => toggle(label)}
          label={label.charAt(0).toUpperCase() + label.slice(1)}
          key={label}
          spaceBetween
        />
      ))}
    </SLabelToggle>
  )
}

export const ExportData = () => {
  const [showDropdown, setDropdown] = useState(false)
  const [timeRange, setTimeRange] = useState(timeRangeEnum.allTime.timestamp)
  const [dropdownTitle, setTitle] = useState("All Time")
  const dropdownRef = useRef()
  const blur = (event) => {
    if (!dropdownRef.current.contains(event.target)) {
      setDropdown(false)
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", blur)
    return () => document.removeEventListener("mousedown", blur)
  }, [])
  return (
    <SExportSection>
      <SDropdown
        onClick={() => setDropdown((state) => !state)}
        ref={dropdownRef}
      >
        <SDropdownOptions show={showDropdown}>
          {Object.values(timeRangeEnum).map(({ timestamp, title }) => (
            <SDropdownItem
              onClick={() => {
                setTimeRange(timestamp)
                setTitle(title)
              }}
              key={title}
            >
              {title}
            </SDropdownItem>
          ))}
        </SDropdownOptions>
        <SDropdownSelection>
          {dropdownTitle}
          <Icons.ChevronDown size="24px" />
        </SDropdownSelection>
      </SDropdown>
      <SExportButton
        onClick={() => {
          initiateDownload(exportTypeEnum.TSV, timeRange)
        }}
      >
        TSV
      </SExportButton>
      <SExportButton
        onClick={() => initiateDownload(exportTypeEnum.JSON, timeRange)}
      >
        JSON
      </SExportButton>
    </SExportSection>
  )
}
